import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useCallback, useEffect, useRef, useState } from 'react'

import { CollectionPlanet } from '@/components/Galaxy/CollectionPlanet'
import { ColoredGrid } from '@/components/Icon/ColoredGrid'
import { HappySun } from '@/components/Icon/HappySun'
import { Help } from '@/components/Icon/Help'
// import { HelpModal } from '@/components/Journey/HelpModal'
import { LoadingSpinner } from '../../components/Loading/LoadingSpinner'
import { PairType } from '@/types/Pairs/Pair'
import { PodiumSharp } from '@/components/Icon/PodiumSharp'
import { fetchCollections } from '@/utils/flow'
import { generateNonOverlappingOrbitCoordinates } from '@/utils/helpers'
import { useRouter } from 'next/router'
import { useWindowWidth } from '@react-hook/window-size/throttled'
import Button from '@/components/Button'

const PLANET_SIZE = 150

export default function Galaxy() {
  const router = useRouter()
  // const [open, setOpen] = useState(false)
  const [cords, setCords] = useState<Array<{ x: number; y: number }>>([])
  const [collections, setCollections] = useState<PairType[]>([])
  const isPanning = useRef(false)
  const [showHelpModal, setShowHelpModal] = useState(() =>
    Boolean(router.query.welcome)
  )
  // const [showNewSectionsModal, setShowNewSectionsModal] = useState(false)
  // const [showCustomizeModal, setShowCustomizeModal] = useState(true)
  // const { flowStatus, updateFlowStatus } = useSession()
  const width = useWindowWidth()

  // useEffect(() => {
  //   const func = async () => {
  //     const status = await updateFlowStatus()
  //     if (
  //       (!status.impact || !status.expertise) &&
  //       status.checkpoint.type !== 'initial'
  //     ) {
  //       setOpen(true)
  //     }
  //   }

  //   func()
  // }, [updateFlowStatus])

  useEffect(() => {
    fetchCollections()
      .then((data) => setCollections(data))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setCords(
      generateNonOverlappingOrbitCoordinates(5, width < 1600 ? 2 : 2.5)
        .concat(
          generateNonOverlappingOrbitCoordinates(10, width < 1600 ? 1.3 : 1.4)
        )
        .concat(generateNonOverlappingOrbitCoordinates(20, 1.1))
    )
  }, [width])

  const handlePlanetClick = (collection: PairType) => () => {
    if (isPanning.current) return
    if (
      (collection.progress === 'Finished' ||
        collection.progress === 'Attested') &&
      !collection.hasSubcollections &&
      !collection.hasCompositeProjects
    )
      return router.push(`/ranking`)
    if (collection.hasSubcollections || collection.hasCompositeProjects) {
      return router.push(`/galaxy/${collection.id}`)
    }
    return router.push(`/poll/${collection.id}`)
  }

  const checkShowHelpModalCondition = useCallback(() => {
    // This is a workaround until the backend returns a better checkpoint response
    const justOnePlanetUnlockedUnstarted =
      collections.filter(
        (collection) => !collection.locked || collection.started
      ).length === 1

    const bool = justOnePlanetUnlockedUnstarted

    return bool
  }, [collections])

  useEffect(() => {
    setShowHelpModal(checkShowHelpModalCondition())
  }, [checkShowHelpModalCondition])

  // useEffect(() => {
  //   const hasUnlockedUnstartedCollection = collections.some(
  //     (collection) => !collection.locked && !collection.started
  //   )

  //   if (
  //     flowStatus.checkpoint.type !== 'initial' &&
  //     hasUnlockedUnstartedCollection &&
  //     !checkShowHelpModalCondition()
  //   )
  //     setShowNewSectionsModal(true)
  //   else setShowNewSectionsModal(false)
  // }, [collections, showHelpModal, checkShowHelpModalCondition, flowStatus])

  // if (
  //   checkShowHelpModalCondition() &&
  //   (showCustomizeModal || collections.length === 0)
  // ) {
  //   setTimeout(() => setShowCustomizeModal(false), 3 * 1000)
  //   return <CustomizeExperienceModal isOpen={true} onClose={() => {}} />
  // }

  if (collections.length === 0) {
    return (
      <div
        className="flex items-center justify-center w-full"
        style={{ height: 'calc(100vh - 60px)' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* {showNewSectionsModal && (
        <NewSectionsModal
          isOpen={true}
          onClose={() => {
            setShowNewSectionsModal(false)
          }}
        />
      )} */}
      {/* {(showHelpModal || router.query.welcome) && (
        <HelpModal
          isOpen={true}
          onClose={() => {
            setShowHelpModal(false)
            if (router.query.welcome) router.replace('', { query: {} })
          }}
        />
      )} */}

      <ColoredGrid className="absolute w-full text-white max-h-screen-content" />
      <TransformWrapper
        centerOnInit
        initialScale={2.5}
        onPanning={() => (isPanning.current = true)}
        onPanningStop={() => {
          setTimeout(() => {
            isPanning.current = false
          }, 50)
        }}>
        <TransformComponent>
          <div
            className="flex items-center justify-center w-screen p-10 overflow-hidden"
            style={{ height: 'calc(100vh - 60px - 120px)' }}>
            <div
              className="relative flex items-center justify-center shrink-0"
              style={{
                width: '200vw',
                height: '200vh',
                transform: 'scale(.3)',
              }}>
              <div className="relative flex items-center justify-center w-screen h-screen ">
                {cords.length &&
                  collections.map((collection, idx) => {
                    const { x, y } = cords[idx]

                    return (
                      <div
                        className={`absolute flex ${
                          collection.locked
                            ? 'cursor-default'
                            : 'cursor-pointer'
                        } items-center justify-center`}
                        key={collection.id}
                        onClick={handlePlanetClick(collection)}
                        style={{
                          width: `${PLANET_SIZE}px`,
                          height: `${PLANET_SIZE}px`,
                          left: `${x - PLANET_SIZE / 2}px`,
                          top: `${y - PLANET_SIZE / 2}px`,
                        }}>
                        <CollectionPlanet
                          hasCompositeProjects={collection.hasCompositeProjects}
                          hasSubcollections={collection.hasSubcollections}
                          locked={false}
                          name={collection.name}
                          progress={collection.progress}
                        />
                      </div>
                    )
                  })}
                <HappySun />
              </div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* <MainQuestionsModal isOpen={open} onClose={() => setOpen(false)} /> */}
      <div className="fixed bottom-0 flex h-[113px]  w-full  items-center justify-between rounded-t-[25%] bg-gray-10 px-48 text-lg text-black">
        <Button varient="primary" onClick={() => setShowHelpModal(true)}>
          Help
          <Help />
        </Button>
        <p>
          <strong>Click a planet to begin ranking</strong>
        </p>
        <div>
          <Button varient="primary" onClick={() => router.push('/ranking')}>
            Ranking
            <PodiumSharp />
          </Button>
        </div>
      </div>
    </div>
  )
}
