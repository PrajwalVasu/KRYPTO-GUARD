from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List
from ..schemas.learning import (
    ScamCategorySummary,
    ScamCategoryDetail,
    DailyTipResponse,
    JargonTermResponse,
    TargetAudience,
)
from ..services.learning_service import (
    get_categories,
    get_category_by_id,
    get_all_tips,
    get_daily_tip,
    get_jargon_terms,
)

router = APIRouter()

@router.get("/categories", response_model=List[ScamCategorySummary])
async def list_categories(
    audience: Optional[TargetAudience] = Query(None, description="Filter by audience ('all', 'students', 'seniors')"),
    search: Optional[str] = Query(None, description="Search term for title, tagline, description, keywords")
):
    """Retrieve scam categories summary list with optional audience and search filters."""
    categories = await get_categories(audience=audience, search=search)
    return categories


@router.get("/categories/{category_id}", response_model=ScamCategoryDetail)
async def get_category_detail(category_id: str):
    """Retrieve complete educational details, lifecycle steps, and shield rules for a specific scam category."""
    category = await get_category_by_id(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


@router.get("/daily-tip", response_model=DailyTipResponse)
async def retrieve_daily_tip(
    audience: Optional[TargetAudience] = Query(None, description="Target audience ('all', 'students', 'seniors')")
):
    """Retrieve a deterministic daily tip for the requested audience based on date."""
    tip = await get_daily_tip(audience=audience)
    if not tip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No daily tip found"
        )
    return tip


@router.get("/tips", response_model=List[DailyTipResponse])
async def list_all_tips(
    audience: Optional[TargetAudience] = Query(None, description="Filter by target audience")
):
    """Retrieve all daily safety tips."""
    tips = await get_all_tips(audience=audience)
    return tips


@router.get("/jargon", response_model=List[JargonTermResponse])
async def list_jargon_terms(
    search: Optional[str] = Query(None, description="Search in term name, Hindi term, or meaning")
):
    """Retrieve cybersecurity jargon terms and plain analogies."""
    terms = await get_jargon_terms(search=search)
    return terms
