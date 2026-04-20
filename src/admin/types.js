/**
 * @typedef {Object} AdminSessionRead
 * @property {string} username
 * @property {boolean} authenticated
 */

/**
 * @typedef {Object} AdminArtifactRead
 * @property {boolean} exists
 * @property {string | null} path
 * @property {string | null} updated_at
 */

/**
 * @typedef {AdminArtifactRead & {
 *   node_count: number | null,
 *   edge_count: number | null,
 *   last_generated: string | null,
 * }} AdminGraphArtifactRead
 */

/**
 * @typedef {Object} AdminRagArtifactRead
 * @property {number} snapshot_count
 * @property {AdminArtifactRead} latest_snapshot
 * @property {string[]} index_paths
 * @property {number | null} chunks_count
 */

/**
 * @typedef {Object} AdminOverviewResponse
 * @property {{
 *   subjects_count: number,
 *   notes_count: number,
 *   concepts_count: number,
 *   missing_note_json_count: number,
 *   missing_note_md_count: number,
 * }} content
 * @property {{
 *   graph_count: number,
 *   latest_graph_updated_at: string | null,
 * }} graph
 * @property {{
 *   snapshot_count: number,
 *   indexed_subject_count: number,
 *   latest_snapshot_updated_at: string | null,
 * }} rag
 * @property {{
 *   health_status: string,
 *   database_connected: boolean,
 *   admin_ui_built: boolean,
 * }} system
 */

/**
 * @typedef {Object} AdminNoteSummary
 * @property {string} note_slug
 * @property {string} title
 * @property {number} topic_order
 * @property {AdminArtifactRead} content_json
 * @property {AdminArtifactRead} content_md
 * @property {string | null} generated_at
 * @property {string | null} difficulty
 * @property {number | null} estimated_learning_time_minutes
 * @property {string[]} prerequisites
 */

/**
 * @typedef {Object} AdminSubjectSummary
 * @property {string} subject_slug
 * @property {string} title
 * @property {string} stable_id
 * @property {AdminArtifactRead} outline
 * @property {AdminArtifactRead} concept_library
 * @property {AdminGraphArtifactRead} graph
 * @property {AdminRagArtifactRead} rag
 * @property {number} note_count
 * @property {number} concept_count
 * @property {number} missing_note_json_count
 * @property {number} missing_note_md_count
 * @property {string | null} latest_note_updated_at
 */

/**
 * @typedef {Object} AdminSubjectListResponse
 * @property {AdminSubjectSummary[]} subjects
 */

/**
 * @typedef {Object} AdminSubjectDetailResponse
 * @property {AdminSubjectSummary} subject
 * @property {AdminNoteSummary[]} notes
 */

/**
 * @typedef {Object} AdminStatusCheck
 * @property {boolean} ok
 * @property {string} label
 * @property {string | null} detail
 * @property {string} checked_at
 */

/**
 * @typedef {Object} AdminDirectoryStatus
 * @property {string} name
 * @property {string} path
 * @property {boolean} exists
 * @property {string | null} updated_at
 */

/**
 * @typedef {Object} AdminSystemStatusResponse
 * @property {AdminStatusCheck} health
 * @property {AdminStatusCheck} database
 * @property {AdminStatusCheck} admin_ui
 * @property {{
 *   app_name: string,
 *   app_env: string,
 *   api_prefix: string,
 *   repo_root: string,
 * }} environment
 * @property {AdminDirectoryStatus[]} directories
 * @property {{
 *   graph_count: number,
 *   latest_graph_updated_at: string | null,
 * }} graph
 * @property {{
 *   snapshot_count: number,
 *   indexed_subject_count: number,
 *   latest_snapshot_updated_at: string | null,
 * }} rag
 */

export {};
