import date from "date-fns/format/index.js";

const { dfnsFormat } = date;
export const formatDate = (stamp, format) => dfnsFormat(stamp, format);
