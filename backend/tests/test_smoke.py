import asyncio

from app.main import health, list_review_items


def run_async(coro):
    return asyncio.run(coro)


def test_health_check() -> None:
    assert run_async(health()) == {"status": "ok"}


def test_review_items_endpoint_returns_seed_data() -> None:
    response = run_async(list_review_items())
    assert len(response["items"]) > 0


def test_active_queue_excludes_every_terminal_status() -> None:
    response = run_async(list_review_items())

    statuses = {item["status"] for item in response["items"]}

    assert statuses.isdisjoint({"approved", "rejected", "escalated"})


def test_active_queue_is_ordered_by_risk_tier_then_age() -> None:
    response = run_async(list_review_items())

    item_ids = [item["id"] for item in response["items"]]

    assert item_ids == [
        "RV-1024",
        "RV-1030",
        "RV-1025",
        "RV-1032",
        "RV-1035",
        "RV-1026",
        "RV-1028",
        "RV-1027",
        "RV-1031",
    ]

