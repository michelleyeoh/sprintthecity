// This code is borrowed from Alex Reardon's Pragmatic board example: https://github.com/alexreardon/pragmatic-board
"use client";

import {
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Ellipsis, Plus } from "lucide-react";
import {
  FormEvent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import invariant from "tiny-invariant";
import { useRouter } from "next/navigation";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { Card, CardShadow } from "./card";
import {
  getColumnData,
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TCardData,
  TColumn,
} from "./data";
import { blockBoardPanningAttr } from "./data-attributes";
import { isShallowEqual } from "./is-shallow-equal";
import { SettingsContext } from "./settings-context";
import { createCard } from "@/app/_actions/Card/createCard";

type TColumnState =
  | {
      type: "is-card-over";
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: "is-column-over";
    }
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    };

const stateStyles: { [Key in TColumnState["type"]]: string } = {
  idle: "cursor-default",
  "is-card-over": "outline outline-2 outline-neutral-50",
  "is-dragging": "opacity-40",
  "is-column-over": "bg-slate-900",
};

const idle = { type: "idle" } satisfies TColumnState;

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(function CardList({ column }: { column: TColumn }) {
  return column.cards.map((card) => (
    <Card key={card.id} card={card} columnId={column.id} />
  ));
});

export function Column({ column }: { column: TColumn }) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { settings } = useContext(SettingsContext);
  const [state, setState] = useState<TColumnState>(idle);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();

    if (!trimmedDescription || !trimmedLocation) {
      setError("Description and location are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createCard({
        description: trimmedDescription,
        location: trimmedLocation,
        columnId: column.id,
      });
      setDescription("");
      setLocation("");
      setIsAddingCard(false);
      router.refresh();
    } catch {
      setError("Could not create the card. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const scrollable = scrollableRef.current;
    const header = headerRef.current;
    const inner = innerRef.current;
    invariant(outer);
    invariant(scrollable);
    invariant(header);
    invariant(inner);

    const data = getColumnData({ column });

    function setIsCardOver({
      data,
      location,
    }: {
      data: TCardData;
      location: DragLocationHistory;
    }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = Boolean(
        innerMost && isCardDropTargetData(innerMost.data),
      );

      const proposed: TColumnState = {
        type: "is-card-over",
        dragging: data.rect,
        isOverChildCard,
      };
      // optimization - don't update state if we don't need to.
      setState((current) => {
        if (isShallowEqual(proposed, current)) {
          return current;
        }
        return proposed;
      });
    }

    return combine(
      dropTargetForElements({
        element: outer,
        getData: () => data,
        canDrop({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getIsSticky: () => true,
        onDragStart({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },
        onDragEnter({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
          if (
            isColumnData(source.data) &&
            source.data.column.id !== column.id
          ) {
            setState({ type: "is-column-over" });
          }
        },
        onDropTargetChange({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
        },
        onDragLeave({ source }) {
          if (
            isColumnData(source.data) &&
            source.data.column.id === column.id
          ) {
            return;
          }
          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        element: scrollable,
      }),
      unsafeOverflowAutoScrollForElements({
        element: scrollable,
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!settings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getOverflow() {
          return {
            forTopEdge: {
              top: 1000,
            },
            forBottomEdge: {
              bottom: 1000,
            },
          };
        },
      }),
    );
  }, [column, settings]);

  return (
    <div
      className="flex w-72 flex-shrink-0 select-none flex-col"
      ref={outerFullHeightRef}
    >
      <div
        className={`flex max-h-full flex-col rounded-lg bg-[#F8F8F8] text-[#292A2E] ${stateStyles[state.type]}`}
        ref={innerRef}
        {...{ [blockBoardPanningAttr]: true }}
      >
        {/* Extra wrapping element to make it easy to toggle visibility of content when a column is dragging over */}
        <div
          className={`flex max-h-full flex-col ${state.type === "is-column-over" ? "invisible" : ""}`}
        >
          <div
            className="flex flex-row items-center justify-between p-3 pb-2"
            ref={headerRef}
          >
            <div className="pl-2 font-bold leading-4">{column.title}</div>
            <button
              type="button"
              className="rounded p-2 hover:bg-[#DDDDDD] active:bg-[#DADADA]"
              aria-label="More actions"
            >
              <Ellipsis size={16} />
            </button>
          </div>
          <div
            className="flex flex-col overflow-y-auto [overflow-anchor:none] [scrollbar-color:theme(colors.slate.600)_theme(colors.slate.700)] [scrollbar-width:thin]"
            ref={scrollableRef}
          >
            <CardList column={column} />
            {state.type === "is-card-over" && !state.isOverChildCard ? (
              <div className="flex-shrink-0 px-3 py-1">
                <CardShadow dragging={state.dragging} />
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-2 p-3">
            {isAddingCard ? (
              <form className="flex w-full flex-col gap-2" onSubmit={handleAddCard}>
                <input
                  className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500"
                  placeholder="Card description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500"
                  placeholder="Location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  disabled={isSubmitting}
                />
                {error ? <div className="text-xs text-red-600">{error}</div> : null}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center rounded bg-[#5b0f00] px-3 py-2 text-sm text-white hover:bg-[#7a1a00] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add card"}
                  </button>
                  <button
                    type="button"
                    className="rounded px-3 py-2 text-sm hover:bg-[#DDDDDD]"
                    onClick={() => {
                      setIsAddingCard(false);
                      setError(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="flex flex-grow flex-row gap-1 rounded p-2 hover:bg-[#DDDDDD] active:bg-[#DADADA]"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus size={16} />
                <div className="leading-4">Add a card</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
