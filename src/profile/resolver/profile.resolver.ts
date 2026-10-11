import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../service/index.js';
import { Experience, Link, Profile, Project, Skill } from '../type/index.js';

/**
 * Резолвер визитки.
 */
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  /**
   * Возвращает визитку.
   * @return профиль
   */
  @Query(() => Profile)
  profile() {
    return this.profiles.getProfile();
  }

  /**
   * Возвращает ссылки визитки.
   * @param profile визитка
   * @return список ссылок
   */
  @ResolveField(() => [Link])
  links(@Parent() profile: Profile) {
    return this.profiles.getLinks(profile.id);
  }

  /**
   * Возвращает навыки визитки.
   * @param profile визитка
   * @return список навыков
   */
  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile) {
    return this.profiles.getSkills(profile.id);
  }

  /**
   * Возвращает места работы визитки.
   * @param profile визитка
   * @return список мест работы
   */
  @ResolveField(() => [Experience])
  experience(@Parent() profile: Profile) {
    return this.profiles.getExperience(profile.id);
  }

  /**
   * Возвращает проекты визитки.
   * @param profile визитка
   * @return список проектов
   */
  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile) {
    return this.profiles.getProjects(profile.id);
  }
}
