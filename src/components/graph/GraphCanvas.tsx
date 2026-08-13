// "use client";

// import { useMemo, useState } from "react";

// import GraphNode from "./GraphNode";

// import type {
//   CareerGraph,
//   CareerRole,
//   CareerSkill,
//   GraphNode as GraphNodeData,
// } from "@/src/hooks/useCareerGraph";

// interface GraphCanvasProps {
//   graph: CareerGraph | null;
//   loading?: boolean;
// }

// export default function GraphCanvas({
//   graph,
//   loading = false,
// }: GraphCanvasProps) {
//   const [selectedNodeId, setSelectedNodeId] =
//     useState<string | null>(null);

//   // ============================================================
//   // DERIVE SKILLS / ROLES FROM GRAPH NODES
//   // ============================================================

//   const skills = useMemo<CareerSkill[]>(() => {
//     if (!graph) {
//       return [];
//     }

//     return graph.nodes
//       .filter((node) => node.label === "Skill")
//       .map((node) => {
//         const properties = node.properties;

//         return {
//           id: node.id,
//           name: String(
//             properties.name ?? "Unknown Skill",
//           ),
//           slug: String(
//             properties.slug ?? "",
//           ),
//           category: String(
//             properties.category ?? "",
//           ),
//           description:
//             properties.description
//               ? String(
//                   properties.description,
//                 )
//               : undefined,
//         };
//       });
//   }, [graph]);

//   const roles = useMemo<CareerRole[]>(() => {
//     if (!graph) {
//       return [];
//     }

//     return graph.nodes
//       .filter((node) => node.label === "Role")
//       .map((node) => {
//         const properties = node.properties;

//         return {
//           id: node.id,
//           name: String(
//             properties.name ?? "Unknown Role",
//           ),
//           slug: String(
//             properties.slug ?? "",
//           ),
//           category: String(
//             properties.category ?? "",
//           ),
//           level: properties.level
//             ? String(properties.level)
//             : undefined,
//           description:
//             properties.description
//               ? String(
//                   properties.description,
//                 )
//               : undefined,
//           salaryRange:
//             properties.salaryRange
//               ? String(
//                   properties.salaryRange,
//                 )
//               : undefined,
//           matchScore:
//             properties.matchScore !==
//             undefined
//               ? Number(
//                   properties.matchScore,
//                 )
//               : undefined,
//         };
//       });
//   }, [graph]);

//   const totalNodes = useMemo(() => {
//     return graph?.nodes.length ?? 0;
//   }, [graph]);

//   const totalRelationships = useMemo(() => {
//     return graph?.relationships.length ?? 0;
//   }, [graph]);

//   // ============================================================
//   // NODE CLICK
//   // ============================================================

//   const handleNodeClick = (id: string) => {
//     setSelectedNodeId((current) =>
//       current === id ? null : id,
//     );
//   };

//   // ============================================================
//   // LOADING
//   // ============================================================

//   if (loading) {
//     return (
//       <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <h2 className="text-base font-semibold text-foreground">
//               Career Graph
//             </h2>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Building career relationships...
//             </p>
//           </div>

//           <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
//         </div>

//         <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 6 }).map(
//             (_, index) => (
//               <div
//                 key={index}
//                 className="h-28 animate-pulse rounded-xl border border-border bg-muted"
//               />
//             ),
//           )}
//         </div>
//       </section>
//     );
//   }

//   // ============================================================
//   // EMPTY
//   // ============================================================

//   if (!graph || totalNodes === 0) {
//     return (
//       <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
//         <div className="mx-auto max-w-md">
//           <h2 className="text-base font-semibold text-foreground">
//             Career Graph
//           </h2>

//           <p className="mt-2 text-sm leading-6 text-muted-foreground">
//             Select one or more skills and click{" "}
//             <span className="font-medium text-foreground">
//               Explore Graph
//             </span>{" "}
//             to discover related career roles.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
//       {/* ========================================================
//           HEADER
//       ======================================================== */}

//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-base font-semibold text-foreground">
//             Career Graph
//           </h2>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Skills and career roles connected in
//             the graph.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
//             {skills.length} skills
//           </span>

//           <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
//             {roles.length} roles
//           </span>

//           <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
//             {totalRelationships} connections
//           </span>
//         </div>
//       </div>

//       {/* ========================================================
//           SELECTED NODE
//       ======================================================== */}

//       {selectedNodeId && (
//         <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
//           <p className="text-xs text-primary">
//             Node selected. Click it again to deselect.
//           </p>
//         </div>
//       )}

//       {/* ========================================================
//           SKILLS
//       ======================================================== */}

//       {skills.length > 0 && (
//         <div className="mt-6">
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-foreground">
//               Skills
//             </h3>

//             <span className="text-xs text-muted-foreground">
//               {skills.length}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {skills.map((skill) => (
//               <GraphNode
//                 key={`skill-${skill.id}`}
//                 node={skill}
//                 type="skill"
//                 selected={
//                   selectedNodeId ===
//                   `skill-${skill.id}`
//                 }
//                 onClick={() =>
//                   handleNodeClick(
//                     `skill-${skill.id}`,
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ========================================================
//           CONNECTION
//       ======================================================== */}

//       {skills.length > 0 && roles.length > 0 && (
//         <div className="my-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-border" />

//           <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
//             Connected Career Roles
//           </span>

//           <div className="h-px flex-1 bg-border" />
//         </div>
//       )}

//       {/* ========================================================
//           ROLES
//       ======================================================== */}

//       {roles.length > 0 && (
//         <div>
//           <div className="mb-3 flex items-center justify-between">
//             <h3 className="text-sm font-semibold text-foreground">
//               Career Roles
//             </h3>

//             <span className="text-xs text-muted-foreground">
//               {roles.length}
//             </span>
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {roles.map((role) => (
//               <GraphNode
//                 key={`role-${role.id}`}
//                 node={role}
//                 type="role"
//                 selected={
//                   selectedNodeId ===
//                   `role-${role.id}`
//                 }
//                 onClick={() =>
//                   handleNodeClick(
//                     `role-${role.id}`,
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ========================================================
//           NO SKILLS
//       ======================================================== */}

//       {skills.length === 0 && (
//         <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center">
//           <p className="text-sm text-muted-foreground">
//             No skill nodes found in this graph.
//           </p>
//         </div>
//       )}

//       {/* ========================================================
//           NO ROLES
//       ======================================================== */}

//       {roles.length === 0 && (
//         <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center">
//           <p className="text-sm text-muted-foreground">
//             No career roles found for the selected
//             skills.
//           </p>
//         </div>
//       )}

//       {/* ========================================================
//           FOOTER
//       ======================================================== */}

//       <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
//         <div className="flex items-center gap-2">
//           <span className="h-2 w-2 rounded-full bg-primary" />

//           <span className="text-xs text-muted-foreground">
//             Skill
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="h-2 w-2 rounded-full bg-secondary-foreground" />

//           <span className="text-xs text-muted-foreground">
//             Career Role
//           </span>
//         </div>

//         <span className="ml-auto text-xs text-muted-foreground">
//           {totalNodes} total nodes
//         </span>
//       </div>
//     </section>
//   );
// }


"use client";

import { useMemo, useState } from "react";

import GraphNode from "./GraphNode";

import type {
  CareerGraph,
  CareerRole,
  CareerSkill,
} from "@/src/hooks/useCareerGraph";

interface GraphCanvasProps {
  graph: CareerGraph | null;
  loading?: boolean;
}

export default function GraphCanvas({
  graph,
  loading = false,
}: GraphCanvasProps) {
  const [selectedNodeId, setSelectedNodeId] =
    useState<string | null>(null);

  // ============================================================
  // DERIVED NODES
  // ============================================================

  const skills = useMemo<CareerSkill[]>(() => {
    if (!graph?.nodes) {
      return [];
    }

    return graph.nodes
      .filter((node) => node.label === "Skill")
      .map((node) => {
        const properties = node.properties;

        return {
          id: node.id,
          name: String(
            properties.name ?? "Unknown Skill",
          ),
          slug: String(
            properties.slug ?? "",
          ),
          category: String(
            properties.category ?? "",
          ),
          description: properties.description
            ? String(properties.description)
            : undefined,
        };
      });
  }, [graph]);

  const roles = useMemo<CareerRole[]>(() => {
    if (!graph?.nodes) {
      return [];
    }

    return graph.nodes
      .filter((node) => node.label === "Role")
      .map((node) => {
        const properties = node.properties;

        return {
          id: node.id,
          name: String(
            properties.name ?? "Unknown Role",
          ),
          slug: String(
            properties.slug ?? "",
          ),
          category: String(
            properties.category ?? "",
          ),
          level: properties.level
            ? String(properties.level)
            : undefined,
          description: properties.description
            ? String(properties.description)
            : undefined,
          salaryRange: properties.salaryRange
            ? String(properties.salaryRange)
            : undefined,
          matchScore:
            typeof properties.matchScore ===
            "number"
              ? properties.matchScore
              : undefined,
        };
      });
  }, [graph]);

  // ============================================================
  // RELATIONSHIPS
  // ============================================================

  const relationships = graph?.relationships ?? [];

  const totalNodes = skills.length + roles.length;

  const connectionCount = relationships.length;

  // ============================================================
  // NODE CLICK
  // ============================================================

  const handleNodeClick = (id: string) => {
    setSelectedNodeId((current) =>
      current === id ? null : id,
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Career Graph
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Building career relationships...
            </p>
          </div>

          <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-28
                  animate-pulse
                  rounded-xl
                  border border-border
                  bg-muted
                "
              />
            ),
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (!graph || totalNodes === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto max-w-md">
          <h2 className="text-base font-semibold text-foreground">
            Career Graph
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Select one or more skills and click{" "}
            <span className="font-medium text-foreground">
              Explore Graph
            </span>{" "}
            to discover related career roles.
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Career Graph
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Skills and career roles connected in the graph.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {skills.length} skills
          </span>

          <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {roles.length} roles
          </span>

          <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {connectionCount} connections
          </span>
        </div>
      </div>

      {/* ========================================================
          SELECTED NODE
      ======================================================== */}

      {selectedNodeId && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-xs text-primary">
            Node selected. Click it again to deselect.
          </p>
        </div>
      )}

      {/* ========================================================
          SKILLS
      ======================================================== */}

      {skills.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Skills
            </h3>

            <span className="text-xs text-muted-foreground">
              {skills.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map((skill) => (
              <GraphNode
                key={`skill-${skill.id}`}
                node={skill}
                type="skill"
                selected={
                  selectedNodeId ===
                  `skill-${skill.id}`
                }
                onClick={() =>
                  handleNodeClick(
                    `skill-${skill.id}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          CONNECTION
      ======================================================== */}

      {skills.length > 0 &&
        roles.length > 0 && (
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Connected Career Roles
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>
        )}

      {/* ========================================================
          ROLES
      ======================================================== */}

      {roles.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Career Roles
            </h3>

            <span className="text-xs text-muted-foreground">
              {roles.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {roles.map((role) => (
              <GraphNode
                key={`role-${role.id}`}
                node={role}
                type="role"
                selected={
                  selectedNodeId ===
                  `role-${role.id}`
                }
                onClick={() =>
                  handleNodeClick(
                    `role-${role.id}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          RELATIONSHIP SUMMARY
      ======================================================== */}

      {connectionCount > 0 && (
        <div className="mt-6 rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Graph Connections
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Relationships between skills and career
                roles.
              </p>
            </div>

            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {connectionCount}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(
              new Set(
                relationships.map(
                  (relationship) =>
                    relationship.type,
                ),
              ),
            ).map((type) => {
              const count =
                relationships.filter(
                  (relationship) =>
                    relationship.type === type,
                ).length;

              return (
                <span
                  key={type}
                  className="
                    rounded-full
                    border border-border
                    bg-card
                    px-3 py-1.5
                    text-[11px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  {type} · {count}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />

          <span className="text-xs text-muted-foreground">
            Skill
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondary-foreground" />

          <span className="text-xs text-muted-foreground">
            Career Role
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {totalNodes} total nodes
          </span>

          <span className="text-xs text-muted-foreground">
            {connectionCount} connections
          </span>
        </div>
      </div>
    </section>
  );
}