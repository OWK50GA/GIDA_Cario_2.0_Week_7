#[starknet::interface]
pub trait ThumbsUpTrait<T> {
    fn give_thumbs_up(ref self: T); 
    fn remove_thumbs_up(ref self: T);
    fn get_thumbs_up(ref self: T) -> u64;
}

#[starknet::component]
pub mod ThumbsUpComponent {
    use super::ThumbsUpTrait;
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry};
    use contracts::vote::Candidate;

    #[storage]
    pub struct Storage {
        thumbs_ups: u64 //Number of thumbs up received
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        ThumbsAction: ThumbsAction
    }

    #[derive(Drop, starknet::Event)]
    pub struct ThumbsAction {}


    #[embeddable_as(ThumbsUpper)]
    pub impl ThumbsUpImpl<
        TContractState, +HasComponent<TContractState>
    > of ThumbsUpTrait<ComponentState<TContractState>> {
        fn give_thumbs_up(ref self: ComponentState<TContractState>) {
            self.thumbs_ups.write(self.thumbs_ups.read() + 1);
        }
        fn remove_thumbs_up(ref self: ComponentState<TContractState>) {
            self.thumbs_ups.write(self.thumbs_ups.read() + 1);
        }
        fn get_thumbs_up(ref self: ComponentState<TContractState>) -> u64 {
            self.thumbs_ups.read()
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>) {
            self.thumbs_ups.write(2);
        }
    }
}
