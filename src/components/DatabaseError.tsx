'use client'

import Link from 'next/link'
import { Database, AlertCircle, ExternalLink } from 'lucide-react'

export default function DatabaseError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-2xl w-full">
        <div className="card p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Database className="h-24 w-24 text-gray-400" />
              <AlertCircle className="h-8 w-8 text-red-500 absolute -bottom-1 -right-1" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Database Not Connected</h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            MongoDB is not running or not configured. The application needs a database to work.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Quick Fix Options:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <li>
                <strong>Use MongoDB Atlas (Easiest - 5 minutes)</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Create free account at mongodb.com/cloud/atlas</li>
                  <li>Create a free cluster</li>
                  <li>Get connection string</li>
                  <li>Update MONGODB_URI in .env.local</li>
                  <li>Run: npm run seed</li>
                </ul>
              </li>
              <li className="mt-2">
                <strong>Install MongoDB Locally</strong>
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Download from mongodb.com/try/download/community</li>
                  <li>Install and start MongoDB service</li>
                  <li>Run: npm run seed</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <a
              href="https://www.mongodb.com/cloud/atlas/register"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Create Free MongoDB Atlas Account</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="text-sm text-gray-500">
              <p>After setup, check the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">MONGODB_SETUP.md</code> file for detailed instructions</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3">Current Configuration:</h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-left text-sm font-mono">
              <p className="text-gray-600 dark:text-gray-400">
                MONGODB_URI: {process.env.MONGODB_URI || 'Not set'}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
