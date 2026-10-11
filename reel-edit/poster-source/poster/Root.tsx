import React from 'react';
import {Composition} from 'remotion';
import {Poster} from './Poster';
import {Cover} from './Cover';
import {FPS, TOTAL} from '../src/theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Poster" component={Poster} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  </>
);
