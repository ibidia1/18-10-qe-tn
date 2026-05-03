import React from "react";
import { CalendarDays } from "lucide-react";
import { ExamCountdown } from "./ExamCountdown";
import { ModeToggle } from "./ModeToggle";
import { ViewSwitcher } from "./ViewSwitcher";
import { CourseSearchBar } from "../search/CourseSearchBar";
import { NotificationsBell } from "../panels/NotificationsBell";
import type { OrganizeState, OrganizeActions } from "../hooks/useOrganizeStore";

type View = "month" | "week" | "day";

interface Props {
  state: OrganizeState;
  actions: Pick<OrganizeActions, "setExamDate" | "setAutoMode" | "setLastView" | "markNotificationRead" | "markAllNotificationsRead">;
  view: View;
  onViewChange: (v: View) => void;
  onSearchOpen: () => void;
}

export function OrganizeHeader({ state, actions, view, onViewChange, onSearchOpen }: Props) {
  const unreadCount = state.notifications.filter((n) => !n.readAt).length;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Title */}
      <div className="flex items-center gap-2 mr-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold tracking-tight">S'organiser</h1>
      </div>

      {/* Exam countdown */}
      <ExamCountdown
        examDate={state.examDate}
        onSetExamDate={actions.setExamDate}
      />

      <div className="flex-1" />

      {/* Search bar */}
      <CourseSearchBar onOpen={onSearchOpen} />

      {/* Mode toggle */}
      <ModeToggle
        autoEnabled={state.autoMode.enabled}
        onChange={(auto) => actions.setAutoMode({ ...state.autoMode, enabled: auto })}
      />

      {/* View switcher */}
      <ViewSwitcher view={view} onChange={(v) => { onViewChange(v); actions.setLastView(v); }} />

      {/* Notifications bell */}
      <NotificationsBell
        notifications={state.notifications}
        onMarkRead={actions.markNotificationRead}
        onMarkAllRead={actions.markAllNotificationsRead}
        unreadCount={unreadCount}
      />
    </div>
  );
}
