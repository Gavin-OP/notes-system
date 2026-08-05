# ADR 0001: JobTI and editable Path graph

JobTI remains a deterministic entertainment experience and does not automatically alter Path choices. The pilot Path is a constrained DAG persisted in localStorage. React Flow provides interaction and Dagre provides deterministic layout; cycles, self-links, duplicate links, and disconnected nodes are rejected.
