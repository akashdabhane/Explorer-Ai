import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { queryRAGStreaming, saveStreamingResponse } from '@/lib/ragService';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { query, notebookId, topK, temperature } = await request.json();

    if (!query || !notebookId) {
      return new Response('Query and notebookId are required', { status: 400 });
    }

    const result = await queryRAGStreaming({
      notebookId,
      query,
      topK: topK || 5,
      temperature: temperature || 0.7,
    });

    if (result.noResults) {
      return Response.json({
        answer: result.answer,
        sources: result.sources,
        noResults: true,
      });
    }

    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder();
    let fullAnswer = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send sources first
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources: result.sources })}\n\n`)
          );

          // Stream the answer
          for await (const chunk of result.stream) {
            const text = chunk.text();
            fullAnswer += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', text })}\n\n`)
            );
          }

          // Save conversation history after streaming completes
          await saveStreamingResponse({
            notebookId: result.notebookId,
            query: result.query,
            answer: fullAnswer,
            sources: result.sources,
          });

          // Send completion signal
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
          );
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process query' }),
      { status: 500 }
    );
  }
}
