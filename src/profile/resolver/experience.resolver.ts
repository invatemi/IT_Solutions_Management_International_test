import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../service/index.js';
import { Experience } from '../type/index.js';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly profiles: ProfileService) {}

  @ResolveField(() => [String])
  achievements(@Parent() experience: Experience) {
    return this.profiles.getAchievements(experience.id);
  }
}
