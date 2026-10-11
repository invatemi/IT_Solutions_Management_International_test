import { profileSeed } from './seed-data.js';

describe('profileSeed', () => {
  it('contains the card sections a fresh database is filled with', () => {
    expect(profileSeed.name.length).toBeGreaterThan(0);
    expect(profileSeed.description.length).toBeGreaterThan(0);
    expect(profileSeed.links.map((link) => link.label)).toEqual(
      expect.arrayContaining(['GitHub']),
    );
    expect(profileSeed.skills.length).toBeGreaterThan(0);
    expect(profileSeed.experience[0]?.company.length).toBeGreaterThan(0);
    expect(profileSeed.experience[0]?.achievements.length).toBeGreaterThan(0);
    expect(profileSeed.projects.length).toBeGreaterThan(0);
    for (const project of profileSeed.projects) {
      expect(project.url).toMatch(/^https:\/\//);
    }
  });
});
