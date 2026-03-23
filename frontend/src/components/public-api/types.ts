import { publicApiEndpoints } from "@/lib/public-api";

export type SectionId = (typeof publicApiEndpoints)[number]["id"] | "keys";
