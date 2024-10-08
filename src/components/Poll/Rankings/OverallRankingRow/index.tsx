import {
  EditingCollectionRanking,
  EditingProjectRanking,
} from '../edit-logic/edit'
import React, { useState } from 'react'

import { AttestationModal } from './AttestationModal'
import { CaretDown } from '@/components/Icon/CaretDown'
import { CaretUp } from '@/components/Icon/CaretUp'
import { CategoryContextMenu } from './CategoryContextMenu'
import { EditTextField } from '../EditTextField'
import { HeaderLabels } from './HeaderLabels'
import { PairType } from '../../../../types/Pairs/Pair'
import { PairsType } from '../../../../types/Pairs'
import { ProjectContextMenu } from './ProjectContextMenu'
import { useCollapse } from 'react-collapsed'
import { EditManualModal } from './EditManualModal'
import { formatRankingValue } from '@/utils/helpers'

interface RankingProps {
  data: EditingProjectRanking
  onEditChange: (value: number) => void
  onLockClick: () => void
  editMode: boolean
}

export const OverallRankingRow: React.FC<RankingProps> = ({
  data,
  onEditChange,
  onLockClick,
  editMode,
}) => {
  return (
    <div
      className={`mb-2 flex cursor-pointer items-center gap-6 rounded-lg bg-white/[.4] px-6 py-3 text-black`}>
      <span className="grow">
        {`${data.name} - ${data.star}`}
        <span className="text-2xl">&#9733;</span>
      </span>

      <span className="flex items-center justify-end w-48">
        {!editMode ? (
          <>
            <span className="">{formatRankingValue(data.share)}</span>
            <span className="mb-1 ml-1 align-super text-[8px] text-red">
              OPP
            </span>
          </>
        ) : (
          <EditTextField
            error={data.error}
            focus={false}
            state={data.state}
            onChange={onEditChange}
            onLockClick={onLockClick}
            value={Math.round(data.share * 3e7)}
            type="project"
          />
        )}
      </span>

      <span className="flex items-center justify-end w-20">
        <div className="flex h-[24px] items-center">
          <span className="">
            {(data.share * 100).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="ml-1 text-[8px] text-red">%</span>
        </div>
      </span>
      <span className="flex justify-end w-8">
        <ProjectContextMenu project={data.id} />
      </span>
    </div>
  )
}

interface HeaderProps extends Omit<RankingProps, 'data'> {
  collection?: PairType
  data: EditingCollectionRanking
  children: React.ReactNode
  expanded?: boolean
  level: number
  pairs?: PairsType
}

export const OverallRankingHeader: React.FC<HeaderProps> = ({
  collection,
  data,
  children,
  onEditChange,
  onLockClick,
  editMode,
  expanded = false,
  pairs,
  level,
}) => {
  const [isExpanded, setExpanded] = useState(expanded || false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false)
  const [isEditManualModalOpen, setIsEditManualModalOpen] = useState(false)

  return (
    <div className="flex flex-col items-end w-full mb-2 text-black last:mb-0">
      <div
        className={`flex w-full items-center gap-6 rounded-lg bg-white/[.9] px-6 py-3`}>
        <span
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
          className="flex items-center justify-center w-12 h-6">
          {isExpanded ? <CaretUp /> : <CaretDown />}
        </span>
        <span className="grow">{data.name}</span>
        <span className="flex items-center justify-end w-36">
          <HeaderLabels pairs={pairs} progress={collection?.progress} />
        </span>
        <span className="flex items-center justify-end w-48">
          {!editMode ? (
            <>
              <span className="">{formatRankingValue(data.share)}</span>
              <span className="mb-1 ml-1 align-super text-[8px] text-red">
                OP
              </span>
            </>
          ) : (
            <EditTextField
              error={data.error}
              focus={false}
              state={data.state}
              onChange={onEditChange}
              onLockClick={onLockClick}
              value={Math.round(data.share * 3e7)}
            />
          )}
        </span>{' '}
        <span className="flex items-center justify-end w-20">
          <div className="flex h-[24px] items-center">
            <span className="">
              {(data.share * 100).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="ml-1 text-[8px] text-red">%</span>
          </div>
        </span>
        <span className="flex items-center justify-end w-8">
          {level === 2 && collection && (
            <CategoryContextMenu
              collection={collection}
              openAttestationModal={() => setIsAttestationModalOpen(true)}
              openEditManualModal={() => setIsEditManualModalOpen(true)}
              progress={collection.progress}
              isEditing={editMode}
            />
          )}
          {isAttestationModalOpen && collection && (
            <AttestationModal
              collectionId={collection.id}
              collectionName={collection.name}
              colletionDescription={collection.impactDescription}
              isOpen={isAttestationModalOpen}
              onClose={() => window.location.reload()}
            />
          )}
          {isEditManualModalOpen && (
            <EditManualModal
              collectionId={collection?.id}
              isOpen={isEditManualModalOpen}
              onClose={() => setIsEditManualModalOpen(false)}
            />
          )}
        </span>
      </div>
      <section className={`mt-2 flex w-[97%] flex-col`} {...getCollapseProps()}>
        {children}
      </section>
    </div>
  )
}
