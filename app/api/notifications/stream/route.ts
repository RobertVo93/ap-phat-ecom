import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { notificationEmitter } from '@/lib/eventEmitter';
import { UserService } from '@/lib/services/userService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;

    const userService = new UserService();
    const user = await userService.getCurrentUser(userId!);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        // Callback function when have new event
        const onNewNotification = (data: { userId: string, payload: any }) => {
          // only send notification when have logged-in user
          if (data.userId === userId || data.userId.toString() === userId?.toString()) {
            const message = `data: ${JSON.stringify(data.payload)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
        };

        // subscribe listening
        notificationEmitter.on('new_notification', onNewNotification);

        // Cleanup when client disconnect
        req.signal.addEventListener('abort', () => {
          notificationEmitter.off('new_notification', onNewNotification);
          controller.close();
        });
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("SSE Connection Error:", error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}