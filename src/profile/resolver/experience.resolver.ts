import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../service/index.js';
import { Experience } from '../type/index.js';

/**
 * Резолвер места работы.
 */
@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly profiles: ProfileService) {}

  /**
   * Возвращает достижения места работы.
   * @param experience место работы
   * @return описания достижений
   */
  @ResolveField(() => [String])
  achievements(@Parent() experience: Experience) {
    return this.profiles.getAchievements(experience.id);
  }
}
