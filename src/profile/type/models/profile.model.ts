import { Field, ObjectType } from '@nestjs/graphql';
import { Experience } from './experience.model.js';
import { Link } from './link.model.js';
import { Project } from './project.model.js';
import { Skill } from './skill.model.js';

/**
 * Визитка.
 */
@ObjectType()
export class Profile {
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [Link])
  links!: Link[];

  @Field(() => [Skill])
  skills!: Skill[];

  @Field(() => [Experience])
  experience!: Experience[];

  @Field(() => [Project])
  projects!: Project[];
}
