import { useQuery } from "@tanstack/react-query";

export function usePageContent(page: string) {
  return useQuery<Record<string, Record<string, any>>>({
    queryKey: ["/api/content", page],
    staleTime: 1000 * 60 * 5,
  });
}

export function getVal(content: Record<string, Record<string, any>> | undefined, section: string, key: string, fallback: any = ""): any {
  return content?.[section]?.[key] ?? fallback;
}
