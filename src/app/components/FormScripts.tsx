import type { FC } from 'hono/jsx';
import { loadFormScripts } from './loadFormScripts' with { type: 'macro' };

export const FormScripts: FC = () => {
  return (
    <script dangerouslySetInnerHTML={{
      __html: loadFormScripts()
    }} />
  );
};