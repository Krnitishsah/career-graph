"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import SkillList from "./SkillList";
import SkillSearch from "./SkillSearch";
import SkillSummary from "./SkillSummary";

import useSkills from "../../hooks/useSkills";
import type { Skill } from "../../types/skill";

export default function SkillsExplorer() {
  const router = useRouter();

  const {
    skills = [],
    loading,
    error,
  } = useSkills();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        skills
          .map((skill) => skill.category)
          .filter(
            (item): item is string =>
              typeof item === "string" &&
              item.trim().length > 0,
          ),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [skills]);

  // ============================================================
  // FILTER SKILLS
  // ============================================================

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesCategory =
        !category ||
        skill.category?.toLowerCase() ===
          category.toLowerCase();

      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const roleNames = [
        ...(Array.isArray(skill.relatedRoles)
          ? skill.relatedRoles
          : []),
        ...(Array.isArray(skill.relatedRoleNames)
          ? skill.relatedRoleNames
          : []),
      ];

      const searchableValues = [
        skill.name ?? "",
        skill.slug ?? "",
        skill.category ?? "",
        skill.description ?? "",
        skill.level ?? "",
        skill.proficiency ?? "",
        ...roleNames,
      ];

      return searchableValues.some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(query),
      );
    });
  }, [skills, search, category]);

  // ============================================================
  // FILTER STATE
  // ============================================================

  const hasFilters =
    search.trim().length > 0 ||
    category.trim().length > 0;

  const handleReset = () => {
    setSearch("");
    setCategory("");
  };

  // ============================================================
  // SELECT SKILL
  // ============================================================

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  // ============================================================
  // ESCAPE + BODY SCROLL
  // ============================================================

  useEffect(() => {
    if (!selectedSkill) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    const originalOverflow =
      document.body.style.overflow;

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        originalOverflow;
    };
  }, [selectedSkill]);

  // ============================================================
  // EXPLORE SKILL
  // ============================================================

  const handleExplore = (skill: Skill) => {
    const skillIdentifier =
      skill.slug || skill.id;

    if (!skillIdentifier) {
      return;
    }

    setSelectedSkill(null);

    router.push(
      `/explore?skill=${encodeURIComponent(
        skillIdentifier,
      )}`,
    );
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <section className="space-y-8">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-foreground
              sm:text-3xl
            "
          >
            Explore Skills
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-muted-foreground
              sm:text-base
            "
          >
            Discover technical skills, proficiency
            levels, categories, and career
            opportunities connected to each skill.
          </p>
        </div>

        {!loading && !error && (
          <div
            className="
              shrink-0
              rounded-lg
              border
              border-border
              bg-card
              px-3
              py-2
            "
          >
            <span className="text-sm font-semibold text-foreground">
              {filteredSkills.length}
            </span>{" "}
            <span className="text-sm text-muted-foreground">
              {filteredSkills.length === 1
                ? "skill"
                : "skills"}
            </span>
          </div>
        )}
      </header>

      {/* ========================================================
          SEARCH + FILTER
      ======================================================== */}

      <div
        className="
          rounded-xl
          border
          border-border
          bg-card
          p-4
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
          "
        >
          {/* SEARCH */}

          <div className="w-full lg:max-w-xl">
            <label
              htmlFor="skill-search"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-foreground
              "
            >
              Search skills
            </label>

            <SkillSearch
              value={search}
              onChange={setSearch}
              disabled={loading}
              placeholder="Search skills, categories, or roles..."
            />
          </div>

          {/* CATEGORY */}

          <div className="w-full sm:w-auto">
            <label
              htmlFor="skill-category"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-foreground
              "
            >
              Category
            </label>

            <select
              id="skill-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              disabled={loading}
              className="
                h-11
                w-full
                min-w-52
                rounded-xl
                border
                border-border
                bg-background
                px-3
                text-sm
                text-foreground
                outline-none
                transition-colors
                hover:border-input
                focus:border-primary
                focus:ring-4
                focus:ring-ring/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <option value="">
                All categories
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* RESET */}

          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                h-11
                shrink-0
                rounded-xl
                border
                border-border
                bg-background
                px-4
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                hover:bg-secondary
                hover:text-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-ring/30
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              Reset filters
            </button>
          )}
        </div>

        {/* FILTER SUMMARY */}

        {hasFilters && (
          <div
            className="
              mt-4
              border-t
              border-border
              pt-3
            "
          >
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredSkills.length}
              </span>{" "}
              matching{" "}
              {filteredSkills.length === 1
                ? "skill"
                : "skills"}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-destructive/20
            bg-destructive/5
            px-4
            py-3
          "
        >
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ========================================================
          SKILL LIST
      ======================================================== */}

      <section aria-labelledby="available-skills-heading">
        <div className="mb-4">
          <h2
            id="available-skills-heading"
            className="
              text-lg
              font-semibold
              text-foreground
            "
          >
            Available Skills
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a skill to view its details and
            related career roles.
          </p>
        </div>

        <SkillList
          skills={filteredSkills}
          loading={loading}
          emptyMessage={
            hasFilters
              ? "No skills match your current filters."
              : "No skills available."
          }
          onSkillClick={handleSkillClick}
        />
      </section>

      {/* ========================================================
          SKILL DETAILS MODAL
      ======================================================== */}

      {selectedSkill && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-modal-title"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >
          <article
            className="
              relative
              flex
              max-h-[90vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              shadow-2xl
            "
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {/* MODAL HEADER */}

            <header
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4
                border-b
                border-border
                px-5
                py-4
                sm:px-6
              "
            >
              <div className="min-w-0">
                <h2
                  id="skill-modal-title"
                  className="
                    truncate
                    text-lg
                    font-semibold
                    text-foreground
                  "
                >
                  {selectedSkill.name}
                </h2>

                {selectedSkill.category && (
                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-muted-foreground
                    "
                  >
                    {selectedSkill.category}
                  </p>
                )}
              </div>

              {/* ONLY CLOSE BUTTON */}

              <button
                type="button"
                onClick={handleCloseModal}
                aria-label="Close skill details"
                title="Close"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-border
                  bg-background
                  text-muted-foreground
                  transition-colors
                  hover:bg-secondary
                  hover:text-foreground
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring/30
                "
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </header>

            {/* MODAL CONTENT */}

            <div
              className="
                overflow-y-auto
                p-4
                sm:p-6
              "
            >
              <SkillSummary
                skill={selectedSkill}
                onExplore={handleExplore}
              />
            </div>
          </article>
        </div>
      )}
    </section>
  );
}