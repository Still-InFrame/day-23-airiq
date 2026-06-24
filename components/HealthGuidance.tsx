import { Card, SectionTitle } from "@/components/Card";
import type { Dict } from "@/lib/i18n";
import type { CurrentAirQuality } from "@/lib/types";
import { DEFAULT_USER_GROUP, healthKeyFor, type UserGroupId } from "@/lib/userGroups";

export function HealthGuidance({
  dict,
  data,
  userGroup,
}: {
  dict: Dict;
  data: CurrentAirQuality;
  userGroup: UserGroupId;
}) {
  const actions = dict.aqi.categories[data.categoryKey].actions;
  const groupRec = data.healthRecommendations[healthKeyFor(userGroup)];
  const generalRec = data.healthRecommendations.generalPopulation;
  const showGroupFirst = userGroup !== DEFAULT_USER_GROUP && !!groupRec;

  return (
    <Card>
      <SectionTitle>{dict.health.title}</SectionTitle>

      <p className="text-sm font-semibold text-foreground">{dict.aqi.actionsTitle}</p>
      <ul className="mt-2 space-y-1.5">
        {actions.map((action, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <span aria-hidden className="mt-0.5 text-accent">
              ✓
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ul>

      {showGroupFirst && (
        <div className="mt-4 rounded-xl bg-accent/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {dict.health.forYou} · {dict.groups[userGroup]}
          </p>
          <p className="mt-1 text-sm text-foreground">{groupRec}</p>
        </div>
      )}

      {generalRec && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {dict.health.forEveryone}
          </p>
          <p className="mt-1 text-sm text-foreground">{generalRec}</p>
        </div>
      )}

      {!actions.length && !groupRec && !generalRec && (
        <p className="text-sm text-muted">{dict.health.none}</p>
      )}
    </Card>
  );
}
