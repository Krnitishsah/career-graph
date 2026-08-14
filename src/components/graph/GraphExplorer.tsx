"use client";

import { useMemo, useState } from "react";

import GraphCanvas from "./GraphCanvas";
import GraphFilters from "./GraphFilters";

import useCareerGraph, {
  type CareerGraph,
  type CareerSkill,
} from "../../hooks/useCareerGraph";

export default function GraphExplorer() {
  const {
    getCareerGraph,
    loading,
    error,
  } = useCareerGraph();

  // ============================================================
  // STATE
  // ============================================================

  const [selectedSkills, setSelectedSkills] =
    useState<CareerSkill[]>([]);

  const [nodeType, setNodeType] =
    useState<string>("");

  const [relationship, setRelationship] =
    useState<string>("");

  const [limit, setLimit] =
    useState<number>(25);

  const [graph, setGraph] =
    useState<CareerGraph | null>(null);

  const [graphLoading, setGraphLoading] =
    useState(false);

  // ============================================================
  // ADD SKILL
  // ============================================================

  const handleAddSkill = (
    skill: CareerSkill,
  ) => {
    setSelectedSkills((previous) => {
      const alreadySelected =
        previous.some(
          (item) => item.id === skill.id,
        );

      if (alreadySelected) {
        return previous;
      }

      return [...previous, skill];
    });
  };

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  const handleRemoveSkill = (
    skillId: string,
  ) => {
    setSelectedSkills((previous) =>
      previous.filter(
        (skill) => skill.id !== skillId,
      ),
    );
  };

  // ============================================================
  // APPLY GRAPH
  // ============================================================

  const handleApply = async (
    skillsToExplore: CareerSkill[],
  ) => {
    if (skillsToExplore.length === 0) {
      return;
    }

    const slugs = skillsToExplore
      .map((skill) => skill.slug?.trim())
      .filter(
        (slug): slug is string =>
          Boolean(slug),
      );

    if (slugs.length === 0) {
      return;
    }

    setGraphLoading(true);

    try {
      const result =
        await getCareerGraph(slugs);

      setGraph(result);
    } catch {
      setGraph(null);
    } finally {
      setGraphLoading(false);
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    setSelectedSkills([]);
    setNodeType("");
    setRelationship("");
    setLimit(25);
    setGraph(null);
  };

  // ============================================================
  // FILTER GRAPH
  // ============================================================

  const filteredGraph =
    useMemo<CareerGraph | null>(() => {
      if (!graph) {
        return null;
      }

      const skillNodes = graph.nodes.filter(
        (node) =>
          node.label === "Skill",
      );

      const allRoleNodes =
        graph.nodes.filter(
          (node) =>
            node.label === "Role",
        );

      // --------------------------------------------------------
      // ROLE LIMIT
      // --------------------------------------------------------

      const roleNodes =
        allRoleNodes.slice(0, limit);

      // --------------------------------------------------------
      // NODE TYPE
      // --------------------------------------------------------

      let nodes = [
        ...skillNodes,
        ...roleNodes,
      ];

      if (nodeType === "skill") {
        nodes = skillNodes;
      } else if (nodeType === "role") {
        nodes = roleNodes;
      }

      // --------------------------------------------------------
      // RELATIONSHIP
      // --------------------------------------------------------

      let relationships =
        graph.relationships;

      if (relationship) {
        relationships =
          relationships.filter(
            (relation) =>
              relation.type ===
              relationship,
          );
      }

      // --------------------------------------------------------
      // VISIBLE NODE IDS
      // --------------------------------------------------------

      const visibleNodeIds =
        new Set(
          nodes.map(
            (node) => node.id,
          ),
        );

      // --------------------------------------------------------
      // ONLY KEEP VALID CONNECTIONS
      // --------------------------------------------------------

      relationships =
        relationships.filter(
          (relation) =>
            visibleNodeIds.has(
              relation.source,
            ) &&
            visibleNodeIds.has(
              relation.target,
            ),
        );

      return {
        ...graph,
        nodes,
        relationships,
      };
    }, [
      graph,
      nodeType,
      relationship,
      limit,
    ]);

  // ============================================================
  // ROLE NODES
  // ============================================================

  const roleNodes = useMemo(() => {
    if (!filteredGraph) {
      return [];
    }

    return filteredGraph.nodes.filter(
      (node) =>
        node.label === "Role",
    );
  }, [filteredGraph]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Career Graph
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore relationships between
          technical skills and career
          roles using the career graph.
        </p>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border border-destructive/20
            bg-destructive/5
            px-4 py-3
          "
        >
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <GraphFilters
        selectedSkills={selectedSkills}
        nodeType={nodeType}
        relationship={relationship}
        limit={limit}
        onAddSkill={handleAddSkill}
        onApply={handleApply}
        onRemoveSkill={
          handleRemoveSkill
        }
        onNodeTypeChange={
          setNodeType
        }
        onRelationshipChange={
          setRelationship
        }
        onLimitChange={setLimit}
        onReset={handleReset}
        disabled={
          loading ||
          graphLoading
        }
      />

      {/* ======================================================
          GRAPH
      ====================================================== */}

      <GraphCanvas
        graph={filteredGraph}
        loading={graphLoading}
      />

      {/* ======================================================
          ROLE SUMMARY
      ====================================================== */}

      {filteredGraph && (
        <section
          className="
            rounded-xl
            border border-border
            bg-card
            p-5
            shadow-sm
          "
        >
          {/* Summary Header */}

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Career Roles
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Roles connected to your
                selected skills.
              </p>
            </div>

            <span
              className="
                shrink-0
                rounded-md
                bg-secondary
                px-2.5
                py-1
                text-xs
                font-medium
                text-secondary-foreground
              "
            >
              {roleNodes.length}
            </span>
          </div>

          {/* ==================================================
              ROLE CARDS
          ================================================== */}

          {roleNodes.length > 0 ? (
            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {roleNodes.map(
                (role) => {
                  const properties =
                    role.properties;

                  const name =
                    String(
                      properties.name ??
                        "Unknown Role",
                    );

                  const category =
                    properties.category
                      ? String(
                          properties.category,
                        )
                      : "";

                  const level =
                    properties.level
                      ? String(
                          properties.level,
                        )
                      : "";

                  const description =
                    properties.description
                      ? String(
                          properties.description,
                        )
                      : "";

                  const salaryRange =
                    properties.salaryRange
                      ? String(
                          properties.salaryRange,
                        )
                      : "";

                  const rawMatchScore =
                    properties.matchScore;

                  const matchScore =
                    rawMatchScore !==
                      undefined &&
                    rawMatchScore !==
                      null
                      ? Number(
                          rawMatchScore,
                        )
                      : null;

                  return (
                    <article
                      key={role.id}
                      className="
                        rounded-lg
                        border border-border
                        bg-background
                        p-4
                        transition-colors
                        hover:border-primary/30
                      "
                    >
                      {/* Name + Match */}

                      <div className="flex items-start justify-between gap-3">
                        <h3
                          title={name}
                          className="
                            min-w-0
                            truncate
                            text-sm
                            font-semibold
                            text-foreground
                          "
                        >
                          {name}
                        </h3>

                        {matchScore !==
                          null &&
                          Number.isFinite(
                            matchScore,
                          ) && (
                            <span
                              className="
                                shrink-0
                                rounded-md
                                bg-primary/10
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-primary
                              "
                            >
                              {Math.round(
                                matchScore,
                              )}
                              %
                            </span>
                          )}
                      </div>

                      {/* Category + Level */}

                      {(category ||
                        level) && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {category}

                          {category &&
                            level &&
                            " • "}

                          {level}
                        </p>
                      )}

                      {/* Role Badge */}

                      <span
                        className="
                          mt-3
                          inline-flex
                          rounded-md
                          bg-secondary
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-secondary-foreground
                        "
                      >
                        Career Role
                      </span>

                      {/* Salary */}

                      {salaryRange && (
                        <p
                          className="
                            mt-3
                            text-sm
                            font-semibold
                            text-primary
                          "
                        >
                          {salaryRange}
                        </p>
                      )}

                      {/* Description */}

                      {description && (
                        <p
                          className="
                            mt-3
                            line-clamp-2
                            text-sm
                            leading-5
                            text-muted-foreground
                          "
                        >
                          {description}
                        </p>
                      )}
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            <div
              className="
                mt-5
                rounded-lg
                border
                border-dashed
                border-border
                p-6
                text-center
              "
            >
              <p className="text-sm text-muted-foreground">
                No career roles found
                in the current graph.
              </p>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
