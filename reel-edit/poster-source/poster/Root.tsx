import React from 'react';
import {Composition} from 'remotion';
import {Poster} from './Poster';
import {FPS, TOTAL} from '../src/theme';

export const Root: React.FC = () => (
  <Composition id="Poster" component={Poster} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
