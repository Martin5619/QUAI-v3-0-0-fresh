import { NextResponse } from 'next/server'

export class ApiException extends Error {
  constructor(public status: number, public data: any) {
    super(data.message || 'API Error')
  }
}

export async function withErrorHandling(handler: () => Promise<any>) {
  try {
    const result = await handler()
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof ApiException) {
      return NextResponse.json(error.data, {
        status: error.status,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}
