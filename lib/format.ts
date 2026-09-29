import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: Date) {
  return format(date, "d MMM yyyy", { locale: fr });
}

export function formatDateTime(date: Date) {
  return format(date, "d MMM yyyy 'à' HH:mm", { locale: fr });
}

export function timeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}
