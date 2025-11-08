'use client';

import { Suspense } from 'react';
import { DoctorsPageContent } from './DoctorsPage';
import { DoctorSkeleton } from './DoctorSkeleton';
import { Section, Container } from '@/components/ui/Layout';

function DoctorsPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <Section background="white" padding="lg">
        <Container>
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          
          {/* Page Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <Container>
          {/* Filters skeleton */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Doctors grid skeleton */}
          <DoctorSkeleton viewMode="grid" count={8} />
        </Container>
      </Section>
    </div>
  );
}

export function DoctorsPage() {
  return (
    <Suspense fallback={<DoctorsPageFallback />}>
      <DoctorsPageContent />
    </Suspense>
  );
}
