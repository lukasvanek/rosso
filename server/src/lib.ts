import toPairs from 'ramda/es/toPairs';

export function MapToList<T>(items: { [id: string]: T }, options?: { sortBy: any, sortType: any }): any {
  let { sortBy, sortType } = { sortBy: 'id', sortType: String };
  if (options) {
    sortBy = options.sortBy;
    sortType = options.sortType;
  }
  const list = toPairs(items).map((pair) => ({ id: pair[0], ...pair[1] }));
  if (sortType === String) {
    return list.sort((a, b) => a && b ? (b as any)[sortBy].localeCompare((b as any)[sortBy], 'en') : 1);
  }
  return list;
}

export function ListToMap<T>(items: T[]): any {
  if (!items || !items.forEach) return {};
  const obj: { [id: string]: T } = {};
  items.forEach((item: any) => {
    obj[item.id] = item;
  });
  return obj;
};
