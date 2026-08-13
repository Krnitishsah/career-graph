"use client";

import { useEffect, useMemo, useState } from "react";

import useCareerGraph, {
  type CareerSkill,
} from "../../hooks/useCareerGraph";

interface GraphFiltersProps {
  selectedSkills: CareerSkill[];

  nodeType: string;
  relationship: string;
  limit: number;

  onAddSkill: (skill: CareerSkill) => void;
  onApply: (skills: CareerSkill[]) => void;
  onRemoveSkill: (skillId: string) => void;

  onNodeTypeChange: (value: string) => void;
  onRelationshipChange: (value: string) => void;
  onLimitChange: (value: number) => void;

  onReset: () => void;

  disabled?: boolean;
}

export default function GraphFilters({
  selectedSkills,
  nodeType,
  relationship,
  limit,

  onAddSkill,
  onApply,
  onRemoveSkill,

  onNodeTypeChange,
  onRelationshipChange,
  onLimitChange,

  onReset,

  disabled = false,
}: GraphFiltersProps) {
  const {
    skills,
    loading,
    error,
    getSkills,
    searchSkills,
    clearError,
  } = useCareerGraph();

  const [search, setSearch] = useState("");

  // ============================================================
  // LOAD SKILLS
  // ============================================================

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  // ============================================================
  // SEARCH SKILLS
  // ============================================================

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      getSkills();
      return;
    }

    const timer = setTimeout(() => {
      searchSkills(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, getSkills, searchSkills]);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        skills
          .map((skill) => skill.category)
          .filter(
            (category): category is string =>
              Boolean(category),
          ),
      ),
    ).sort();
  }, [skills]);

  // ============================================================
  // AVAILABLE SKILLS
  // ============================================================

  const availableSkills = useMemo(() => {
    return skills.filter(
      (skill) =>
        !selectedSkills.some(
          (selected) => selected.id === skill.id,
        ),
    );
  }, [skills, selectedSkills]);

  // ============================================================
  // ADD SKILL
  // ============================================================

  const handleAddSkill = (skill: CareerSkill) => {
    onAddSkill(skill);
    setSearch("");
    clearError();
  };

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  const handleRemoveSkill = (skillId: string) => {
    onRemoveSkill(skillId);
    clearError();
  };

  // ============================================================
  // APPLY
  // ============================================================

  const handleApply = () => {
    if (selectedSkills.length === 0) {
      return;
    }

    clearError();
    onApply(selectedSkills);
  };

  // ============================================================
  // CLEAR
  // ============================================================

  const handleClear = () => {
    setSearch("");
    clearError();
    onReset();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* HEADER */}

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          Graph Filters
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Select skills and filters to explore career
          relationships.
        </p>
      </div>

      {/* SEARCH */}

      <div>
        <label
          htmlFor="graph-skill-search"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Search Skills
        </label>

        <input
          id="graph-skill-search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            clearError();
          }}
          placeholder="Search skills..."
          disabled={loading || disabled}
          autoComplete="off"
          className="
            h-11 w-full rounded-lg
            border border-border
            bg-background
            px-3
            text-sm text-foreground
            outline-none
            placeholder:text-muted-foreground
            focus:border-primary
            focus:ring-4
            focus:ring-ring/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />
      </div>

      {/* CATEGORIES */}

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSearch(category);
                clearError();
              }}
              disabled={loading || disabled}
              className="
                rounded-full
                border border-border
                bg-background
                px-3 py-1.5
                text-xs font-medium
                text-muted-foreground
                transition-colors
                hover:bg-secondary
                hover:text-foreground
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* SEARCH RESULTS */}

      {search.trim() && !loading && (
        <div className="mt-4 max-h-60 overflow-y-auto rounded-lg border border-border">
          {availableSkills.length > 0 ? (
            availableSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleAddSkill(skill)}
                disabled={disabled}
                className="
                  flex w-full items-center justify-between
                  gap-4
                  border-b border-border
                  px-4 py-3
                  text-left
                  last:border-b-0
                  hover:bg-secondary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {skill.name}
                  </p>

                  {skill.category && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {skill.category}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-xs font-medium text-primary">
                  Add
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              No skills found.
            </p>
          )}
        </div>
      )}

      {/* SELECTED SKILLS */}

      {selectedSkills.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Selected Skills
            </span>

            <span className="text-xs text-muted-foreground">
              {selectedSkills.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() =>
                  handleRemoveSkill(skill.id)
                }
                disabled={disabled}
                aria-label={`Remove ${skill.name}`}
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-primary/20
                  bg-primary/10
                  px-3 py-1.5
                  text-xs font-medium
                  text-primary
                  transition-colors
                  hover:bg-primary/15
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span>{skill.name}</span>

                <span
                  aria-hidden="true"
                  className="text-sm leading-none"
                >
                  ×
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRAPH OPTIONS */}

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-3">
        {/* NODE TYPE */}

        <div>
          <label
            htmlFor="graph-node-type"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Node Type
          </label>

          <select
            id="graph-node-type"
            value={nodeType}
            onChange={(event) =>
              onNodeTypeChange(event.target.value)
            }
            disabled={disabled}
            className="
              h-10 w-full rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">All nodes</option>
            <option value="skill">Skills only</option>
            <option value="role">Roles only</option>
          </select>
        </div>

        {/* RELATIONSHIP */}

        <div>
          <label
            htmlFor="graph-relationship"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Relationship
          </label>

          <select
            id="graph-relationship"
            value={relationship}
            onChange={(event) =>
              onRelationshipChange(event.target.value)
            }
            disabled={disabled}
            className="
              h-10 w-full rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">All relationships</option>

            <option value="REQUIRES">
              Required Skills
            </option>

            <option value="RELATED_TO">
              Related Skills
            </option>
          </select>
        </div>

        {/* LIMIT */}

        <div>
          <label
            htmlFor="graph-limit"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Role Limit
          </label>

          <select
            id="graph-limit"
            value={limit}
            onChange={(event) =>
              onLimitChange(Number(event.target.value))
            }
            disabled={disabled}
            className="
              h-10 w-full rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              focus:border-primary
              focus:ring-4
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value={10}>10 roles</option>
            <option value={25}>25 roles</option>
            <option value={50}>50 roles</option>
            <option value={100}>100 roles</option>
          </select>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="
            mt-4 rounded-lg
            border border-destructive/20
            bg-destructive/5
            px-3 py-2
          "
        >
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ACTIONS */}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleApply}
          disabled={
            disabled ||
            loading ||
            selectedSkills.length === 0
          }
          className="
            inline-flex h-10 flex-1
            items-center justify-center
            rounded-lg
            bg-primary
            px-4
            text-sm font-medium
            text-primary-foreground
            transition-opacity
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Loading..." : "Explore Graph"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={
            disabled ||
            loading ||
            (!search && selectedSkills.length === 0)
          }
          className="
            inline-flex h-10
            items-center justify-center
            rounded-lg
            border border-border
            bg-background
            px-4
            text-sm font-medium
            text-muted-foreground
            transition-colors
            hover:bg-secondary
            hover:text-foreground
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Clear
        </button>
      </div>
    </section>
  );
}
