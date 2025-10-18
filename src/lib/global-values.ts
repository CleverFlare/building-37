import { db } from "@/server/db";
import type { GlobalConfig } from "@prisma/client";

type GlobalValues = keyof Omit<GlobalConfig, "id">;

async function checkGlobalValuesExist() {
  const globalValuesExist = await db.globalConfig.findFirst();

  return !!globalValuesExist;
}

export async function getGlobalValue(key: GlobalValues) {
  const globalValuesExist = await checkGlobalValuesExist();

  if (!globalValuesExist) await db.globalConfig.create({});

  const globalValues = (await db.globalConfig.findFirst())!;

  if (key in globalValues) return globalValues[key];

  return null;
}

export async function setGlobalValue<T extends GlobalValues>(
  key: T,
  value: GlobalConfig[T],
) {
  const globalValuesExist = await checkGlobalValuesExist();

  if (!globalValuesExist) await db.globalConfig.create({});

  const globalValues = (await db.globalConfig.findFirst())!;

  await db.globalConfig.update({
    where: { id: globalValues.id },
    data: { [key]: value },
  });

  if (key in globalValues) return globalValues[key];

  return null;
}
