import { Module } from '@nestjs/common';
import { ExperienceResolver, ProfileResolver } from '../resolver/index.js';
import { ProfileService } from '../service/index.js';

@Module({
  providers: [ProfileService, ProfileResolver, ExperienceResolver],
})
export class ProfileModule {}
