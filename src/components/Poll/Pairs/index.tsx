import { useEffect, useState } from 'react'
import { PairsType, VOTES } from '@/types/Pairs'
import { PairType } from '@/types/Pairs/Pair'
import { Grid } from '@/components/Icon/Grid'
import { Pair } from '../Pair'

interface PairsProps {
  pairs: PairsType['pairs']
  onVote: (pair: PairType[], star1: number | null, star2: number | null, picked?: number) => void
  activeIndex: number
}
export const Pairs: React.FC<PairsProps> = ({
  pairs = [],
  onVote,
  activeIndex,
}) => {
  // const [activeIndex, setActiveIndex] = useState(0)
  const [voted, setVoted] = useState<VOTES>(VOTES.NONE)

  useEffect(() => {
    setVoted(VOTES.NONE)
  }, [activeIndex])

  return (
    <div className="container relative mx-auto  flex min-w-[900px]  overflow-hidden px-16">
      <div className="absolute inset-0 flex justify-center mx-auto -mt-8 overflow-hidden text-black">
        <Grid />
      </div>
      <div
        className="flex w-full transition-transform duration-500 shrink-0 gap-7">
        <Pair
          onVote={(item, star1, star2, newVoted) => {
            if (voted === VOTES.NONE) {
              setVoted(newVoted)
              onVote(pairs[0], star1, star2, item?.id)
            }
          }}
          pair={pairs[0]}
          voted={voted}
        />
      </div>
    </div>
  )
}
