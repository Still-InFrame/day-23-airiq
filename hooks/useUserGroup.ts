"use client";

import { useEffect, useState } from "react";
import { DEFAULT_USER_GROUP, type UserGroupId } from "@/lib/userGroups";
import { getUserGroup, setUserGroup as persistUserGroup } from "@/lib/storage";

/** Persisted "who is this for" preference that reorders health guidance. */
export function useUserGroup() {
  const [userGroup, setGroup] = useState<UserGroupId>(DEFAULT_USER_GROUP);

  useEffect(() => {
    setGroup(getUserGroup());
  }, []);

  const setUserGroup = (group: UserGroupId) => {
    setGroup(group);
    persistUserGroup(group);
  };

  return { userGroup, setUserGroup };
}
