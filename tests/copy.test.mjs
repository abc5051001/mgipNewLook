import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parse } from '@babel/parser';

const root = new URL('../', import.meta.url);
const copy = JSON.parse(await readFile(new URL('content/firm-copy.json', root), 'utf8'));
const walk = (node, visit) => {
  if (!node || typeof node !== 'object') return;
  visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  }
};
const load = async path => {
  const source = await readFile(new URL(path, root), 'utf8');
  return { source, ast: parse(source, { sourceType: 'module', plugins: ['jsx'] }) };
};
const text = node => {
  if (node.type === 'JSXText') return node.value.replace(/\s+/g, ' ').trim();
  if (node.type === 'JSXElement') return node.children.map(text).filter(Boolean).join(' ');
  return '';
};
const visibleTexts = (ast, tag) => {
  const result = [];
  walk(ast, node => {
    if (node.type === 'JSXElement' && node.openingElement.name.name === tag) result.push(text(node));
  });
  return result;
};

test('services, six benefits, eight milestones and statistics retain original strings exactly', async () => {
  const { source, ast } = await load('components/InfoSection/InfoSection.jsx');
  for (const [name, expected] of [['services',copy.services],['features',copy.features],['milestones',copy.milestones],['stats',copy.stats]]) {
    let original;
    walk(ast, node => {
      if(node.type !== 'VariableDeclarator' || node.id.name !== name)return;
      // Evaluate only the retained literal data arrays, with inert icon names.
      const icons = Object.fromEntries(['Lightbulb','BadgeCheck','Copyright','Globe','MapPin','Gavel','Briefcase','ShieldCheck','Languages'].map(key=>[key,key]));
      original = JSON.parse(JSON.stringify(vm.runInNewContext('(' + source.slice(node.init.start,node.init.end) + ')', icons))).map(({icon,...entry})=>entry);
    });
    assert.deepEqual(expected, original, name);
  }
  const paragraphs=visibleTexts(ast,'p');
  assert.ok(paragraphs.includes(copy.about.description));
  assert.ok(paragraphs.includes(copy.cta.description));
  const headings=visibleTexts(ast,'h2');
  assert.ok(headings.includes(copy.about.title));
  assert.ok(headings.includes(copy.cta.title));
});

test('original hero, team, careers and contact wording remains verbatim', async () => {
  const hero=await load('components/Hero/Hero.jsx');
  assert.deepEqual(visibleTexts(hero.ast,'p'),[copy.hero.eyebrow,copy.hero.description]);
  assert.equal(visibleTexts(hero.ast,'h1')[0],copy.hero.title);
  for(const [path,expected] of [['components/Team/Team.jsx',copy.team],['components/Careers/Careers.jsx',copy.careers.hero],['components/Contact/Contact.jsx',copy.contact.hero]]) {
    const {ast}=await load(path);let original;
    walk(ast,node=>{if(node.type==='JSXOpeningElement'&&node.name.name==='PageHero')original=Object.fromEntries(node.attributes.filter(attr=>attr.type==='JSXAttribute'&&attr.value?.type==='StringLiteral').map(attr=>[attr.name.name,attr.value.value]));});
    assert.deepEqual(expected,original,path);
  }
  const careers=await load('components/Careers/Careers.jsx');
  const paragraphs=visibleTexts(careers.ast,'p');
  for(const value of copy.careers.paragraphs)assert.ok(paragraphs.includes(value));
});
