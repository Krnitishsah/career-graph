// ============================================================
// GRAPH TYPES
// ============================================================

// ============================================================
// GRAPH NODE TYPES
// ============================================================

export type GraphNodeType =
  | "Skill"
  | "Role"
  | "Project"
  | "Category";

// ============================================================
// GRAPH RELATIONSHIP TYPES
// ============================================================

export type GraphRelationshipType =
  | "RELATED_TO"
  | "REQUIRES"
  | "BELONGS_TO"
  | "HAS_SKILL"
  | "SIMILAR_TO"
  | "LEADS_TO";

// ============================================================
// GRAPH NODE
// ============================================================

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  properties?: Record<string, unknown>;
}

// ============================================================
// GRAPH EDGE
// ============================================================

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphRelationshipType;
  label?: string;
  properties?: Record<string, unknown>;
}

// ============================================================
// GRAPH DATA
// ============================================================

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================================
// GRAPH QUERY
// ============================================================

export interface GraphQuery {
  id: string;
  type?: GraphNodeType;
  depth?: number;
  limit?: number;
}

// ============================================================
// GRAPH EXPLORE QUERY
// ============================================================

export interface GraphExploreQuery {
  nodeId: string;
  nodeType?: GraphNodeType;
  depth?: number;
  limit?: number;
}

// ============================================================
// GRAPH SEARCH QUERY
// ============================================================

export interface GraphSearchQuery {
  search: string;
  type?: GraphNodeType;
  limit?: number;
}

// ============================================================
// GRAPH NODE RESULT
// ============================================================

export interface GraphNodeResult {
  id: string;
  name: string;
  type: GraphNodeType;
  slug?: string;
  category?: string;
  description?: string;
}

// ============================================================
// GRAPH RELATIONSHIP RESULT
// ============================================================

export interface GraphRelationshipResult {
  source: GraphNodeResult;
  target: GraphNodeResult;
  relationship: GraphRelationshipType;
}

// ============================================================
// GRAPH RESPONSE
// ============================================================

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================================
// RELATED NODE
// ============================================================

export interface RelatedGraphNode {
  id: string;
  name: string;
  type: GraphNodeType;
  relationship: GraphRelationshipType;
  distance?: number;
}

// ============================================================
// GRAPH SUMMARY
// ============================================================

export interface GraphSummary {
  nodeCount: number;
  edgeCount: number;
  skillCount?: number;
  roleCount?: number;
  projectCount?: number;
  categoryCount?: number;
}

// ============================================================
// GRAPH RESULT
// ============================================================

export interface GraphResult {
  graph: GraphData;
  summary?: GraphSummary;
}

// ============================================================
// GRAPH CONNECTION
// ============================================================

export interface GraphConnection {
  sourceId: string;
  targetId: string;
  relationship: GraphRelationshipType;
}