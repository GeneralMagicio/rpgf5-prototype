import { ArrowBackward } from '@/components/Icon/ArrowBackward'
import { Close } from '@/components/Icon/Close'
import { Shuffle } from '@/components/Icon/Shuffle'
import { Tick } from '@/components/Icon/Tick'
import Button from '@/components/Button'
import { Excel } from '@/components/Icon/Excel'
import { useState } from 'react'
import { axiosInstance } from '@/utils/axiosInstance'

interface Props {
  onAttest?: () => void
  onDone?: () => void
  onEdit: () => void
  onBack: () => void
  editMode: boolean
  onUpdate: () => void
  error: boolean
  isOverallRanking: boolean
}

export const RankingPageHeader: React.FC<Props> = ({
  onAttest,
  onEdit,
  editMode,
  onBack,
  onUpdate,
  onDone,
  error,
  isOverallRanking,
}) => {
  const [exportStatus, setExportStatus] = useState<"initial" | "loading" | "download">("initial")
  const [exportHash, setExportHash] = useState<string>()

  const exportExcel = async () => {
    setExportStatus("loading")
    const res = await axiosInstance.get<string>('/flow/ranking/overall/excel')
    setExportHash(res.data)
    setExportStatus("download")
  }

  return (
    <header className="relative flex  h-[95px] items-center justify-between gap-4 bg-gray-30 px-36 font-IBM text-lg font-semibold text-black">
      <div className="flex justify-start w-64">
        <Button varient="primary" size="large" onClick={onBack}>
          {!editMode ? (
            <>
              <ArrowBackward className="scale-75" />
              <span>Back</span>
            </>
          ) : (
            <>
              <span>Cancel</span>
              <Close className="scale-[70%]" />
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
