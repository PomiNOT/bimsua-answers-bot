import { AnswerSheet } from './types';
import { createCanvas, PNGStream, registerFont } from 'node-canvas';

registerFont('fonts/Inter-Bold.ttf', { family: 'Inter', weight: 'bold' });
registerFont('fonts/Inter-Regular.ttf', { family: 'Inter', weight: 'regular' });
registerFont('fonts/Quicksand-Bold.ttf', { family: 'Quicksand', weight: 'bold' });

export function drawSheet(sheet: AnswerSheet): PNGStream {
  const BOTTOM_MARGIN = 35;
  const W = 1280;
  const H = 720 + BOTTOM_MARGIN;
  const canvas = createCanvas(W, H);
  const c = canvas.getContext('2d');

  const NX = 5;
  const NY = 10;
  const TILE_W = W / NX;
  const TILE_H = (H - BOTTOM_MARGIN) / NY;
  const SPACE = 5;

  c.fillStyle = '#000000';
  c.fillRect(0, 0, W, H);

  for (let x = 0; x < NX; x++) {
    for (let y = 0; y < NY; y++) {
      const x0 = x * TILE_W + SPACE;
      const y0 = y * TILE_H + SPACE;
      const boxWidth = TILE_W - 2 * SPACE;
      const boxHeight = TILE_H - 2 * SPACE;
      const leftBoxWidth = (TILE_W - 2 * SPACE) / 3;
      const leftBoxHeight = boxHeight;
      const currentQuestion = x * NY + y + 1;

      c.fillStyle = sheet.sheet[currentQuestion] ? 'rgb(0, 200, 0)' : 'rgb(50, 50, 50)';
      c.fillRect(
        x0,
        y0,
        boxWidth,
        boxHeight
      );
      c.fillStyle = sheet.sheet[currentQuestion] ? 'rgb(0, 255, 0)' : 'rgb(70, 70, 70)';
      c.fillRect(
        x0,
        y0,
        leftBoxWidth,
        leftBoxHeight
      );

      c.fillStyle = '#ffffff';
      c.font = `bold ${TILE_H / 2}px Inter`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(
        currentQuestion.toString(),
        x0 + leftBoxWidth / 2,
        y0 + leftBoxHeight / 2
      );

      c.font = `regular ${TILE_H / 2}px Inter`;
      c.fillText(
        sheet.sheet[currentQuestion] ?? '?',
        x0 + leftBoxWidth + (boxWidth - leftBoxWidth) / 2,
        y0 + boxHeight / 2
      );
    }
  }

  c.font = 'bold 25px Inter';
  c.fillStyle = 'rgb(200, 200, 200)';
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.fillText(`${sheet.name} - ${sheet.nQuestion} questions`, SPACE, H - BOTTOM_MARGIN / 2);

  c.font = 'bold 25px Quicksand';
  c.textAlign = 'right';
  c.fillText('theAnswers', W - SPACE, H - BOTTOM_MARGIN / 2);

  return canvas.createPNGStream();
}