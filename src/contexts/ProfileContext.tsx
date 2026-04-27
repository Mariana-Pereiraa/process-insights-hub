import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ProfileRole = "secgov" | "unidade";

export interface ProfileInfo {
  role: ProfileRole;
  label: string;        // ex: "Governança (SECGOV)"
  unidadeNome: string;  // ex: "Secretaria de Governança"
  unidadeSigla: string; // ex: "SECGOV"
  userName: string;
  userUsername: string;
}

export const PROFILES: Record<ProfileRole, ProfileInfo> = {
  secgov: {
    role: "secgov",
    label: "Governança (SECGOV)",
    unidadeNome: "Secretaria de Governança",
    unidadeSigla: "SECGOV",
    userName: "Equipe SECGOV",
    userUsername: "equipe.secgov",
  },
  unidade: {
    role: "unidade",
    label: "Gabinete do Reitor (GR)",
    unidadeNome: "Gabinete do Reitor",
    unidadeSigla: "GR",
    userName: "Mariana Pereira Da Silva",
    userUsername: "mariana.silva",
  },
};

interface ProfileContextValue {
  profile: ProfileInfo;
  setRole: (role: ProfileRole) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "active-profile-role";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<ProfileRole>("secgov");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "secgov" || saved === "unidade") setRoleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setRole = (next: ProfileRole) => {
    setRoleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<ProfileContextValue>(
    () => ({ profile: PROFILES[role], setRole }),
    [role]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
