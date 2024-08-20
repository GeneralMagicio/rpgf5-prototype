import { ArrowBackward } from '@/components/Icon/ArrowBackward'
import { ArrowForward } from '../../../Icon/ArrowForward'
/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import { Lock } from '@/components/Icon/Lock'
import { Unlocked } from '@/components/Icon/Unlocked'
import cn from 'classnames'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Button from '@/components/Button'

interface HeaderProps {
  question: string
  // handleFinishVoting: () => void
  total: number
  name: string
  voted: number
  minVotesToUnlock: number
}

export const Header: React.FC<HeaderProps> = ({
  question,
  // handleFinishVoting,
  total,
  voted,
  minVotesToUnlock,
  name,
}) => {
  const router = useRouter()
  const cid = router.query.cid
  const progressPercentage = Math.max((voted / total) * 100, 4)
  const voteCountsToUnklock = minVotesToUnlock - voted
  const canFinish = voted >= minVotesToUnlock

  return (
    <div
      className={cn(
        styles.Header,
        'relative z-30  flex h-[93px] items-center justify-between gap-4 px-20 text-lg font-semibold text-black'
      )}>
      <div className="flex justify-start w-44">
        <Button
          varient="primary"
          size="large"
          onClick={() => {
            router.back()
          }}>
          <ArrowBackward />
          <span>Back</span>
        </Button>
      </div>
      <p className="max-w-xl text-xl font-bold text-center">{question}</p>
      <div className="flex justify-end w-44">
        <a href={`${cid}/ranking`} target="_blank" rel="noreferrer">
          <Button
            varient="primary"
            size="large"
            className={cn('group  disabled:text-gray-400 group-hover:flex')}
            // disabled={!canFinish}
            // onClick={handleFinishVoting}
          >
            Ranking
          </Button>
        </a>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white"></div>
      <div
        className="absolute bottom-0 left-0 h-1 transition-all bg-red"
        style={{
          width: `${progressPercentage}%`,
        }}></div>

      <div
        className="absolute top-[90%] min-w-max -translate-x-1/2 translate-y-full rounded-2xl bg-white px-3 py-1 text-xs transition-all"
        style={{
          left: `${Math.min(progressPercentage, 96)}%`,
        }}>
        <span className="text-red">{voted}</span> of {total}
        <div className="absolute inset-x-0 top-0 w-0 h-0 mx-auto -translate-y-full border-b-8 border-x-8 border-x-transparent border-b-white"></div>
      </div>
    </div>
  )
}
