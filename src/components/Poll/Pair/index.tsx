import { useEffect, useState } from 'react'
import { Abstain } from './Abstain'
import { VoteCard } from './VoteCard'
import cn from 'classnames'
import { PairType } from '@/types/Pairs/Pair'
import { VOTES } from '@/types/Pairs'
import Modal from '@/components/Modal/Modal'
import { VoteModal } from './VoteModal'
import { useRouter } from 'next/router'

interface PairProps {
  onVote: (pair: PairType | null, star1: number | null, star2: number | null, voted: VOTES) => void
  // hidden?: boolean
  voted: VOTES
  pair: PairType[]
}

export const Pair: React.FC<PairProps> = ({ onVote, voted, pair }) => {
  const router = useRouter()
  const [a, b] = pair
  const [hoverdItem, setHoverdItem] = useState<VOTES>(VOTES.NONE)
  const [selectedItem, setSelectedItem] = useState<PairType | null>(null)

  const [ratingA, setRatingA] = useState(a.rating);
  const [ratingB, setRatingB] = useState(b.rating);


  useEffect(() => {
    setRatingA(a.rating)
  }, [a])

  useEffect(() => {
    setRatingB(b.rating)
  }, [b])

  const handleRatingForA = (newRating: PairType['rating']) => {
    setRatingA(newRating);
  }

  const handleRatingForB = (newRating: PairType['rating']) => {

    console.log("nr:", newRating)
    setRatingB(newRating);
  }

  useEffect(() => {
    setSelectedItem(null)
  }, [router.query.cid])

  return (
    <div
      className={cn(
        // { 'opacity-0': hidden },
        'relative transition-opacity items-center z-10 mt-10 flex w-full min-w-max  max-w-screen-2xl shrink-0 justify-between gap-5'
      )}>
      <VoteCard
        item={a}
        rating={ratingA}
        onRatingChange={handleRatingForA}
        key={a.id}
        onClick={() => onVote(a, ratingA, ratingB, VOTES.LEFT)}
        onMouseEnter={() => setHoverdItem(VOTES.LEFT)}
        onMouseLeave={() => setHoverdItem(VOTES.NONE)}
        onQuickView={() => setSelectedItem(a)}
        placement="left"
        selected={voted === VOTES.LEFT}
        varient={
          hoverdItem === VOTES.ABSTAIN
            ? 'skew'
            : hoverdItem === VOTES.RIGHT
            ? 'fade'
            : 'normal'
        }
      />
      <Abstain
        onClick={() => onVote(null, ratingA, ratingB, VOTES.NONE)}
        onMouseEnter={() => setHoverdItem(VOTES.ABSTAIN)}
        onMouseLeave={() => setHoverdItem(VOTES.NONE)}
        selected={voted === VOTES.ABSTAIN}
      />
      <VoteCard
        item={b}
        rating={ratingB}
        onRatingChange={handleRatingForB}
        key={b.id}
        onClick={() => onVote(b, ratingA, ratingB, VOTES.RIGHT)}
        onMouseEnter={() => setHoverdItem(VOTES.RIGHT)}
        onMouseLeave={() => setHoverdItem(VOTES.NONE)}
        onQuickView={() => setSelectedItem(b)}
        placement="right"
        selected={voted === VOTES.RIGHT}
        varient={
          hoverdItem === VOTES.ABSTAIN
            ? 'skew'
            : hoverdItem === VOTES.LEFT
            ? 'fade'
            : 'normal'
        }
      />
      <Modal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}>
        {selectedItem ? (
          <VoteModal
            handeClose={() => setSelectedItem(null)}
            item={selectedItem}
          />
        ) : (
          <div />
        )}
      </Modal>
    </div>
  )
}
