import { CollectionProgressStatus } from '@/components/Galaxy/types'

export interface PairType {
  id: number
  name: string
  url: string
  rating:  number | null
  image: string
  impactDescription: string
  contributionDescription?: string
  metadataUrl: string
  collection_id: number | null
  created_at: string
  numOfChildren: number
  RPGF3Id: string
  childProjects?: Array<PairType>
  subProjects?: Array<PairType>
  parentId: number | null
  locked: boolean
  hasSubcollections: boolean
  hasCompositeProjects: boolean
  progress: CollectionProgressStatus
  started: boolean
  type: 'collection' | 'project' | 'composite project'
}

export interface PairTypeMetaData {
  applicantType: string
  websiteUrl: string
  bio: string
  contributionDescription: string
  contributionLinks: {
    type: string
    url: string
    description: string
  }[]
  impactCategory: [string]
  impactDescription: string
  impactMetrics: {
    description: string
    number: number
    url: string
  }[]
  fundingSources: {
    type: string
    currency: string
    amount: 0
    description: string
  }[]
  payoutAddress: string
  understoodKYCRequirements: boolean
  understoodFundClaimPeriod: boolean
  certifiedNotDesignatedOrSanctionedOrBlocked: boolean
  certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity: boolean
  certifiedNotBarredFromParticipating: boolean
}
