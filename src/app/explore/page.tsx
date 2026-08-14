"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import GraphFilters from "../../components/graph/GraphFilters";

import useCareerGraph, {
  type CareerGraph,
  type CareerRole,
  type CareerSkill,
} from "../../hooks/useCareerGraph";

// ============================================================
// PAGE
// ============================================================

export default function ExplorePage() {
  const {
    roles,
    loading,
    error,
    getRoles,
    getCareerGraph,
    clearError,
  } = useCareerGraph();

  // ============================================================
  // STATE
  // ============================================================

  const [selectedSkills, setSelectedSkills] = useState<
    CareerSkill[]
  >([]);

  const [graph, setGraph] = useState<CareerGraph | null>(
    null,
  );

  const [nodeType, setNodeType] = useState("");

  const [relationship, setRelationship] = useState("");

  const [limit, setLimit] = useState(25);

  const [hasExplored, setHasExplored] = useState(false);

  // ============================================================
  // LOAD ROLES
  // ============================================================

  useEffect(() => {
    void getRoles();
  }, [getRoles]);

  // ============================================================
  // ADD SKILL
  // ============================================================

  const handleAddSkill = useCallback(
    (skill: CareerSkill) => {
      setSelectedSkills((current) => {
        const alreadySelected = current.some(
          (selected) => selected.id === skill.id,
        );

        if (alreadySelected) {
          return current;
        }

        return [...current, skill];
      });

      clearError();
    },
    [clearError],
  );

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  const handleRemoveSkill = useCallback(
    (skillId: string) => {
      setSelectedSkills((current) =>
        current.filter(
          (skill) => skill.id !== skillId,
        ),
      );

      clearError();
    },
    [clearError],
  );

  // ============================================================
  // EXPLORE GRAPH
  // ============================================================

  const handleApply = useCallback(
    async (skills: CareerSkill[]) => {
      if (!skills.length) {
        return;
      }

      const skillSlugs = skills
        .map((skill) => skill.slug)
        .filter(
          (slug): slug is string =>
            Boolean(slug),
        );

      if (!skillSlugs.length) {
        return;
      }

      clearError();
      setHasExplored(true);

      const data = await getCareerGraph(
        skillSlugs,
      );

      if (!data) {
        setGraph(null);
        return;
      }

      setGraph(data);
    },
    [clearError, getCareerGraph],
  );

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = useCallback(() => {
    setSelectedSkills([]);
    setGraph(null);
    setHasExplored(false);
    setNodeType("");
    setRelationship("");
    setLimit(25);

    clearError();
  }, [clearError]);

  // ============================================================
  // SELECTED SKILL IDS
  // ============================================================

  const selectedSkillIds = useMemo(
    () =>
      new Set(
        selectedSkills.map(
          (skill) => skill.id,
        ),
      ),
    [selectedSkills],
  );

  // ============================================================
  // GRAPH ROLE IDS
  // ============================================================

  const graphRoleIds = useMemo(() => {
    if (!graph) {
      return new Set<string>();
    }

    return new Set(
      graph.nodes
        .filter(
          (node) =>
            node.label.toLowerCase() ===
            "role",
        )
        .map((node) => node.id),
    );
  }, [graph]);

  // ============================================================
  // GRAPH SKILL IDS
  // ============================================================

  const graphSkillIds = useMemo(() => {
    if (!graph) {
      return new Set<string>();
    }

    return new Set(
      graph.nodes
        .filter(
          (node) =>
            node.label.toLowerCase() ===
            "skill",
        )
        .map((node) => node.id),
    );
  }, [graph]);

  // ============================================================
  // FILTERED ROLES
  // ============================================================

  const filteredRoles = useMemo(() => {
    /*
     * The Career Roles section only displays roles.
     * Therefore selecting "skill" as node type means
     * there are no role cards to display.
     */
    if (nodeType === "skill") {
      return [];
    }

    /*
     * Relationship filters require an explored graph.
     */
    if (
      (relationship === "REQUIRES" ||
        relationship === "RELATED_TO") &&
      !graph
    ) {
      return [];
    }

    let result = [...roles];

    // ----------------------------------------------------------
    // AFTER GRAPH EXPLORE
    // ----------------------------------------------------------

    if (hasExplored && graph) {
      result = result.filter((role) =>
        graphRoleIds.has(role.id),
      );
    }

    // ----------------------------------------------------------
    // REQUIRES
    // ----------------------------------------------------------

    if (
      relationship === "REQUIRES" &&
      graph
    ) {
      const requiredRoleIds =
        new Set<string>();

      graph.relationships.forEach(
        (relation) => {
          if (
            relation.type !== "REQUIRES"
          ) {
            return;
          }

          const sourceIsRole =
            graphRoleIds.has(
              relation.source,
            );

          const targetIsRole =
            graphRoleIds.has(
              relation.target,
            );

          const sourceIsSkill =
            graphSkillIds.has(
              relation.source,
            );

          const targetIsSkill =
            graphSkillIds.has(
              relation.target,
            );

          /*
           * Role -> Skill
           */
          if (
            sourceIsRole &&
            targetIsSkill
          ) {
            requiredRoleIds.add(
              relation.source,
            );
          }

          /*
           * Skill -> Role
           */
          if (
            sourceIsSkill &&
            targetIsRole
          ) {
            requiredRoleIds.add(
              relation.target,
            );
          }
        },
      );

      result = result.filter((role) =>
        requiredRoleIds.has(role.id),
      );
    }

    // ----------------------------------------------------------
    // RELATED_TO
    // ----------------------------------------------------------

    if (
      relationship === "RELATED_TO" &&
      graph
    ) {
      /*
       * RELATED_TO connects skills to skills.
       * It does not directly represent a career role.
       *
       * Therefore the Career Roles section should
       * not display roles when this relationship
       * filter is selected.
       */
      return [];
    }

    // ----------------------------------------------------------
    // LIMIT
    // ----------------------------------------------------------

    return result.slice(0, limit);
  }, [
    roles,
    graph,
    graphRoleIds,
    graphSkillIds,
    hasExplored,
    nodeType,
    relationship,
    limit,
  ]);

  // ============================================================
  // GRAPH NODE COUNTS
  // ============================================================

  const graphNodeCounts = useMemo(() => {
    if (!graph) {
      return {
        total: 0,
        skills: 0,
        roles: 0,
      };
    }

    let skillsCount = 0;
    let rolesCount = 0;

    graph.nodes.forEach((node) => {
      const label =
        node.label.toLowerCase();

      if (label === "skill") {
        skillsCount++;
      }

      if (label === "role") {
        rolesCount++;
      }
    });

    return {
      total: graph.nodes.length,
      skills: skillsCount,
      roles: rolesCount,
    };
  }, [graph]);

  // ============================================================
  // RELATIONSHIP COUNTS
  // ============================================================

  const relationshipCounts = useMemo(() => {
    if (!graph) {
      return {
        total: 0,
        requires: 0,
        relatedTo: 0,
      };
    }

    let requires = 0;
    let relatedTo = 0;

    graph.relationships.forEach(
      (relation) => {
        if (
          relation.type === "REQUIRES"
        ) {
          requires++;
        }

        if (
          relation.type === "RELATED_TO"
        ) {
          relatedTo++;
        }
      },
    );

    return {
      total: graph.relationships.length,
      requires,
      relatedTo,
    };
  }, [graph]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-background">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className="mb-8">
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-foreground
            "
          >
            Career Graph
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-muted-foreground
            "
          >
            Explore relationships between
            technical skills and career roles
            using the career graph.
          </p>
        </header>

        {/* ================================================== */}
        {/* FILTERS */}
        {/* ================================================== */}

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
          disabled={loading}
        />

        {/* ================================================== */}
        {/* GRAPH SUMMARY */}
        {/* ================================================== */}

        <section
          className="
            mt-8
            rounded-xl
            border
            border-border
            bg-card
            p-5
            shadow-sm
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-foreground
                "
              >
                Career Graph
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                {hasExplored
                  ? "Relationships discovered from your selected skills."
                  : "Select one or more skills and click Explore Graph to discover related career roles."}
              </p>
            </div>

            {graph && (
              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  text-sm
                "
              >
                <div>
                  <span className="font-semibold text-foreground">
                    {graphNodeCounts.total}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    nodes
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-foreground">
                    {
                      relationshipCounts.total
                    }
                  </span>{" "}
                  <span className="text-muted-foreground">
                    relationships
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* EMPTY STATE */}
          {/* ================================================= */}

          {!hasExplored && (
            <div
              className="
                mt-6
                flex
                min-h-48
                items-center
                justify-center
                rounded-lg
                border
                border-dashed
                border-border
                bg-background
              "
            >
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  No graph loaded
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select skills above and
                  explore the graph.
                </p>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {hasExplored && loading && (
            <div
              className="
                mt-6
                flex
                min-h-48
                items-center
                justify-center
                rounded-lg
                border
                border-border
                bg-background
              "
            >
              <p className="text-sm text-muted-foreground">
                Loading career graph...
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* GRAPH STATS */}
          {/* ================================================= */}

          {hasExplored &&
            !loading &&
            graph && (
              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >
                <GraphStat
                  label="Selected Skills"
                  value={
                    selectedSkills.length
                  }
                />

                <GraphStat
                  label="Graph Nodes"
                  value={
                    graphNodeCounts.total
                  }
                />

                <GraphStat
                  label="Roles"
                  value={
                    graphNodeCounts.roles
                  }
                />

                <GraphStat
                  label="Relationships"
                  value={
                    relationshipCounts.total
                  }
                />
              </div>
            )}

          {/* ================================================= */}
          {/* RELATIONSHIP SUMMARY */}
          {/* ================================================= */}

          {hasExplored &&
            !loading &&
            graph && (
              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                <GraphStat
                  label="Required Skill Relations"
                  value={
                    relationshipCounts.requires
                  }
                />

                <GraphStat
                  label="Related Skill Relations"
                  value={
                    relationshipCounts.relatedTo
                  }
                />
              </div>
            )}
        </section>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div
            role="alert"
            className="
              mt-6
              rounded-xl
              border
              border-destructive/20
              bg-destructive/5
              px-4
              py-3
            "
          >
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* CAREER ROLES */}
        {/* ================================================== */}

        <section className="mt-8">
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Career Roles
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Roles connected to your
                selected skills.
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-secondary
                px-3
                py-1
                text-sm
                font-medium
                text-foreground
              "
            >
              {filteredRoles.length}
            </span>
          </div>

          {/* ================================================= */}
          {/* EMPTY */}
          {/* ================================================= */}

          {filteredRoles.length === 0 ? (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-border
                bg-card
                p-10
                text-center
              "
            >
              <p className="text-sm font-medium text-foreground">
                {hasExplored
                  ? "No matching career roles found."
                  : "Explore the graph to discover career roles."}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try selecting different
                skills or adjusting the
                filters.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {filteredRoles.map(
                (role) => (
                  <CareerRoleCard
                    key={role.id}
                    role={role}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// ============================================================
// GRAPH STAT
// ============================================================

interface GraphStatProps {
  label: string;
  value: number;
}

function GraphStat({
  label,
  value,
}: GraphStatProps) {
  return (
    <div
      className="
        rounded-lg
        border
        border-border
        bg-background
        p-4
      "
    >
      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-wide
          text-muted-foreground
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-2xl
          font-bold
          text-foreground
        "
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================
// ROLE CARD
// ============================================================

interface CareerRoleCardProps {
  role: CareerRole;
}

function CareerRoleCard({
  role,
}: CareerRoleCardProps) {
  return (
    <article
      className="
        rounded-xl
        border
        border-border
        bg-card
        p-5
        shadow-sm
        transition-shadow
        hover:shadow-md
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="min-w-0">
          <h3
            title={role.name}
            className="
              truncate
              text-lg
              font-semibold
              text-foreground
            "
          >
            {role.name}
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            {role.category}

            {role.level && (
              <>
                {" "}
                • {role.level}
              </>
            )}
          </p>
        </div>

        {typeof role.matchScore ===
          "number" &&
          Number.isFinite(
            role.matchScore,
          ) && (
            <span
              className="
                shrink-0
                rounded-full
                bg-primary/10
                px-2.5
                py-1
                text-xs
                font-semibold
                text-primary
              "
            >
              {Math.round(
                role.matchScore,
              )}
              %
            </span>
          )}
      </div>

      {/* SALARY */}

      {role.salaryRange && (
        <p
          className="
            mt-4
            text-sm
            font-semibold
            text-foreground
          "
        >
          {role.salaryRange}
        </p>
      )}

      {/* DESCRIPTION */}

      {role.description && (
        <p
          className="
            mt-3
            line-clamp-3
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          {role.description}
        </p>
      )}

      {/* MATCHED SKILLS */}

      {role.matchedSkills &&
        role.matchedSkills.length > 0 && (
          <div className="mt-4">
            <p
              className="
                mb-2
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              Matched Skills
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-1.5
              "
            >
              {role.matchedSkills
                .slice(0, 5)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className="
                      rounded-full
                      bg-primary/10
                      px-2.5
                      py-1
                      text-xs
                      text-primary
                    "
                  >
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        )}

      {/* MISSING SKILLS */}

      {role.missingSkills &&
        role.missingSkills.length > 0 && (
          <div className="mt-4">
            <p
              className="
                mb-2
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              Missing Skills
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-1.5
              "
            >
              {role.missingSkills
                .slice(0, 5)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className="
                      rounded-full
                      bg-secondary
                      px-2.5
                      py-1
                      text-xs
                      text-muted-foreground
                    "
                  >
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        )}
    </article>
  );
}
