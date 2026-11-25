import re
from datetime import datetime
from typing import Optional, List, Dict, Any
from ..database import get_database
from ..data.scams_data import SCAM_CATEGORIES
from ..data.tips_data import DAILY_TIPS, JARGON_TERMS
from ..schemas.learning import (
    ScamCategorySummary,
    ScamCategoryDetail,
    DailyTipResponse,
    JargonTermResponse,
)

async def init_learning_indexes_and_seed():
    """Ensure indexes and perform idempotent seeding of learning content."""
    db = get_database()

    # 1. Create indexes
    await db.scam_categories.create_index("id", unique=True)
    await db.scam_categories.create_index("audience")
    await db.daily_tips.create_index("id", unique=True)
    await db.daily_tips.create_index("forAudience")
    await db.jargon_terms.create_index("term", unique=True)

    # 2. Idempotent Upsert for Categories
    for cat in SCAM_CATEGORIES:
        data = dict(cat)
        data.pop("_id", None)
        await db.scam_categories.update_one(
            {"id": cat["id"]},
            {"$set": data},
            upsert=True
        )

    # 3. Idempotent Upsert for Daily Tips
    for tip in DAILY_TIPS:
        data = dict(tip)
        data.pop("_id", None)
        await db.daily_tips.update_one(
            {"id": tip["id"]},
            {"$set": data},
            upsert=True
        )

    # 4. Idempotent Upsert for Jargon Terms
    for item in JARGON_TERMS:
        data = dict(item)
        data.pop("_id", None)
        await db.jargon_terms.update_one(
            {"term": item["term"]},
            {"$set": data},
            upsert=True
        )


async def get_categories(
    audience: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve scam categories filtered by audience and/or search term."""
    db = get_database()
    query: Dict[str, Any] = {}

    # Audience filter
    if audience and audience != "all":
        query["$or"] = [{"audience": audience}, {"audience": "all"}]

    # Search filter
    if search:
        search_regex = {"$regex": re.escape(search), "$options": "i"}
        search_query = {
            "$or": [
                {"title": search_regex},
                {"shortTitle": search_regex},
                {"tagline": search_regex},
                {"description": search_regex},
                {"commonKeywords": search_regex},
            ]
        }
        if "$or" in query:
            query = {"$and": [query, search_query]}
        else:
            query.update(search_query)

    cursor = db.scam_categories.find(query)
    categories = []
    # If pymongo AsyncMongoClient or Motor cursor:
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            doc.pop("_id", None)
            categories.append(doc)
    else:
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc.pop("_id", None)
            categories.append(doc)

    return categories


async def get_category_by_id(category_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a complete category detail by its unique stable ID."""
    db = get_database()
    doc = await db.scam_categories.find_one({"id": category_id})
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


async def get_all_tips(audience: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all daily safety tips, optionally filtered by target audience."""
    db = get_database()
    query: Dict[str, Any] = {}
    if audience and audience != "all":
        query["$or"] = [{"forAudience": audience}, {"forAudience": "all"}]

    cursor = db.daily_tips.find(query).sort("id", 1)
    tips = []
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            doc.pop("_id", None)
            tips.append(doc)
    else:
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc.pop("_id", None)
            tips.append(doc)
    return tips


async def get_daily_tip(audience: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Deterministically select one daily tip for the requested audience based on date."""
    tips = await get_all_tips(audience=audience)
    if not tips:
        return None
    # Deterministic rotation: day of the year / date ordinal modulo number of tips
    day_number = datetime.utcnow().date().toordinal()
    selected_index = day_number % len(tips)
    return tips[selected_index]


async def get_jargon_terms(search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve jargon terms with optional search across term, hindiTerm, or meaning."""
    db = get_database()
    query: Dict[str, Any] = {}
    if search:
        search_regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"term": search_regex},
            {"hindiTerm": search_regex},
            {"meaning": search_regex},
        ]

    cursor = db.jargon_terms.find(query)
    terms = []
    if hasattr(cursor, "__aiter__"):
        async for doc in cursor:
            doc.pop("_id", None)
            terms.append(doc)
    else:
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc.pop("_id", None)
            terms.append(doc)
    return terms
