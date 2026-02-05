# Nation Migration Notes (Draft)

This package is designed to be *transportable* to the Nation-hosted app's data model.

Key alignment points (see Nation repo: F3-Data-Models):

- **Org** is the primary hierarchy (`orgType`, `parentId`, `defaultLocationId`)
  - Region and AO are aliases of Org (`orgType: "region"` / `"ao"`).
- **Location** is first-class and referenced by `locationId` / `defaultLocationId`.
- **EventSeries** represents a recurring schedule definition (Nation `Event` where `is_series=true`).
- **EventInstance** represents a single occurrence (Nation `EventInstance`).
- **Attendance** references `eventInstanceId` (Nation `Attendance.event_instance_id`) and supports `isPlanned` + `meta`.

Practical mapping guidance:

- `Region` -> `Org` with `orgType="region"`
- `AO` -> `Org` with `orgType="ao"` and `parentId=<regionOrgId>`
- `Org.defaultLocationId` / `EventSeries.locationId` / `EventInstance.locationId` -> Nation `location_id`
- `EventSeries` -> Nation `Event` (series)
- `EventInstance` -> Nation `EventInstance` (occurrence)
- `Attendance` -> Nation `Attendance` (plus optional AttendanceType mapping)

IDs:
- This library uses string IDs. During export, create a mapping layer to Nation integer IDs if required.
