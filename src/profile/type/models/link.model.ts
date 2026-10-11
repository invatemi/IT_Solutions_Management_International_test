import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Ссылка визитки.
 */
@ObjectType()
export class Link {
  @Field()
  label!: string;

  @Field()
  url!: string;
}
