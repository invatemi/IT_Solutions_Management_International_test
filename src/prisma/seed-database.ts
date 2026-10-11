import type { Db } from './db.js';
import { profileSeed } from './seed-data.js';

/**
 * Записывает визитку, если база ещё пустая.
 * @param db клиент базы данных
 */
export async function seedIfEmpty(db: Db): Promise<void> {
  const existing = await db.orm.public.Profile.first();
  if (existing) {
    return;
  }

  await db.transaction(async (tx) => {
    const profile = await tx.orm.public.Profile.create({
      name: profileSeed.name,
      description: profileSeed.description,
    });

    for (const [index, link] of profileSeed.links.entries()) {
      await tx.orm.public.Link.create({
        label: link.label,
        url: link.url,
        sortOrder: index,
        profileId: profile.id,
      });
    }

    for (const [index, skill] of profileSeed.skills.entries()) {
      await tx.orm.public.Skill.create({
        name: skill.name,
        sortOrder: index,
        profileId: profile.id,
      });
    }

    for (const [index, job] of profileSeed.experience.entries()) {
      const experience = await tx.orm.public.Experience.create({
        company: job.company,
        position: job.position,
        startDate: job.startDate,
        endDate: job.endDate,
        sortOrder: index,
        profileId: profile.id,
      });

      for (const [
        achievementIndex,
        description,
      ] of job.achievements.entries()) {
        await tx.orm.public.Achievement.create({
          description,
          sortOrder: achievementIndex,
          experienceId: experience.id,
        });
      }
    }

    for (const [index, project] of profileSeed.projects.entries()) {
      await tx.orm.public.Project.create({
        name: project.name,
        url: project.url,
        sortOrder: index,
        profileId: profile.id,
      });
    }
  });
}
