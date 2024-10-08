import { CollectionRanking } from '@/components/Poll/Rankings/edit-logic/edit'
import { PairType } from '@/types/Pairs/Pair'
import { PairsType } from '@/types/Pairs'
import { axiosInstance } from './axiosInstance'

export async function fetchPairs(cid?: string) {
  const url = '/flow/pairs'
  return axiosInstance
    .get<PairsType>(url, {
      params: {
        cid,
      },
    })
    .then((res) => res.data)
}

export async function voteProjects({
  id1,
  id2,
  pickedId,
  star1,
  star2
}: {
  id1: number
  id2: number
  star1: number | null
  star2: number | null
  pickedId: number | null
}) {
  return axiosInstance
    .post('/flow/projects/vote', {
      project1Id: id1,
      project2Id: id2,
      pickedId,
      project1Stars: star1,
      project2Stars: star2,
    })
    .then((res) => res.data)
}

export async function getRankings(cid?: string) {
  return axiosInstance
    .get<CollectionRanking>(`/flow/ranking`, {
      params: { cid: cid === 'root' ? null : cid },
    })
    .then((res) => res.data)
}

export async function getOverallRanking(): Promise<CollectionRanking> {
  const { data } = await axiosInstance.get<CollectionRanking[]>(
    `/flow/ranking/overall`
  )
  return {
    id: -1,
    name: 'root',
    ranking: data,
    isTopLevel: false,
    progress: 'Pending',
    share: 1,
    // isFinished: true,
    type: 'collection',
    hasRanking: true,
  }
  // return data
}

export async function getCollection(id: number): Promise<PairType> {
  const { data } = await axiosInstance.get(`/collection/${id}`)
  return data.collection
}

export async function getProject(id: number): Promise<PairType> {
  const { data } = await axiosInstance.get(`/project/${id}`)
  return data.project
}

export async function finishCollections(id: number) {
  const { data } = await axiosInstance.post(`/flow/finish`, {cid: id})
  return data
}