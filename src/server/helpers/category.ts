import { db } from "../db";

export async function getAllDescendantCategoryIds(
  categoryId: string,
): Promise<string[]> {
  // Step 1: Fetch all categories
  const allCategories = await db.category.findMany({
    select: { id: true, parentId: true },
  });

  // Step 2: Build parent → children map
  const parentToChildrenMap: Record<string, string[]> = {};

  for (const category of allCategories) {
    const parentId = category.parentId;
    if (!parentId) continue; // skip root categories

    parentToChildrenMap[parentId] ??= [];

    parentToChildrenMap[parentId].push(category.id);
  }

  // Step 3: Collect all descendants using DFS
  const result: string[] = [];
  const stack = [categoryId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = parentToChildrenMap[currentId] ?? [];
    result.push(...children);
    stack.push(...children);
  }

  return result;
}
