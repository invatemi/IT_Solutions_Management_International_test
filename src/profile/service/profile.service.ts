import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/index.js';
import type {
  ExperienceRecord,
  LinkRecord,
  ProfileRecord,
  ProjectRecord,
  SkillRecord,
} from '../type/index.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(): Promise<ProfileRecord> {
    const profile = await this.prisma.db.orm.public.Profile.first();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
    };
  }

  async getLinks(profileId: number): Promise<LinkRecord[]> {
    const links = await this.prisma.db.orm.public.Link.where((link) =>
      link.profileId.eq(profileId),
    )
      .orderBy((link) => link.sortOrder.asc())
      .all();

    return links.map((link) => ({ label: link.label, url: link.url }));
  }

  async getSkills(profileId: number): Promise<SkillRecord[]> {
    const skills = await this.prisma.db.orm.public.Skill.where((skill) =>
      skill.profileId.eq(profileId),
    )
      .orderBy((skill) => skill.sortOrder.asc())
      .all();

    return skills.map((skill) => ({ name: skill.name }));
  }

  async getExperience(profileId: number): Promise<ExperienceRecord[]> {
    const jobs = await this.prisma.db.orm.public.Experience.where((job) =>
      job.profileId.eq(profileId),
    )
      .orderBy((job) => job.sortOrder.asc())
      .all();

    return jobs.map((job) => ({
      id: job.id,
      company: job.company,
      position: job.position,
      startDate: job.startDate,
      endDate: job.endDate,
    }));
  }

  async getAchievements(experienceId: number): Promise<string[]> {
    const achievements = await this.prisma.db.orm.public.Achievement.where(
      (achievement) => achievement.experienceId.eq(experienceId),
    )
      .orderBy((achievement) => achievement.sortOrder.asc())
      .all();

    return achievements.map((achievement) => achievement.description);
  }

  async getProjects(profileId: number): Promise<ProjectRecord[]> {
    const projects = await this.prisma.db.orm.public.Project.where((project) =>
      project.profileId.eq(profileId),
    )
      .orderBy((project) => project.sortOrder.asc())
      .all();

    return projects.map((project) => ({
      name: project.name,
      url: project.url,
    }));
  }
}
