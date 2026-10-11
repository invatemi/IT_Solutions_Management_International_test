import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../service/index.js';
import { Experience, Link, Profile, Project, Skill } from '../type/index.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => Profile)
  profile() {
    return this.profiles.getProfile();
  }

  @ResolveField(() => [Link])
  links(@Parent() profile: Profile) {
    return this.profiles.getLinks(profile.id);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile) {
    return this.profiles.getSkills(profile.id);
  }

  @ResolveField(() => [Experience])
  experience(@Parent() profile: Profile) {
    return this.profiles.getExperience(profile.id);
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile) {
    return this.profiles.getProjects(profile.id);
  }
}
