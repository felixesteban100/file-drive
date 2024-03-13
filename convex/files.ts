import { ConvexError, v } from 'convex/values'
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server'
import { getUser } from './users'
import { fileTypes } from './schema';
import { waitForDebugger } from 'inspector';
import { Id } from './_generated/dataModel';

export const generateUploadUrl = mutation(async (ctx) => {
    const idenity = await ctx.auth.getUserIdentity()
    if (!idenity) throw new ConvexError("You must be logged in to upload/create a file")
    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await getUser(ctx, tokenIdentifier)
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)
    return hasAccess
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes
    },
    async handler(ctx, args) {
        const idenity = await ctx.auth.getUserIdentity()

        if (!idenity) throw new ConvexError("You must be logged in to upload/create a file")

        const hasAccess = await hasAccessToOrg(ctx, idenity.tokenIdentifier, args.orgId)

        if (!hasAccess) throw new ConvexError('you do not have access to this org')

        await ctx.db.insert('files', {
            name: args.name,
            type: args.type,
            fileId: args.fileId,
            orgId: args.orgId,
        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
    },
    async handler(ctx, args) {
        const idenity = await ctx.auth.getUserIdentity()

        if (!idenity) return []

        const hasAccess = await hasAccessToOrg(ctx, idenity.tokenIdentifier, args.orgId)
        if (!hasAccess) return []

        const allFiles = await ctx.db
            .query("files")
            .withIndex("by_orgId", q => q.eq('orgId', args.orgId))
            .collect()

        const query = args.query

        const filesSelected = query ? allFiles.filter(file => file.name.toLowerCase().includes(query.toLowerCase())) : allFiles

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", idenity.tokenIdentifier))
            .first()

        if (!user) return filesSelected

        if (args.favorites) {
            const favorites = await ctx.db
                .query("favorites")
                .withIndex("by_userId_orgId_fileId", q => q
                    .eq("userId", user?._id)
                    .eq("orgId", args.orgId)
                ).collect()


                // if it's very slow I must refactor these type of filter systems 
            return filesSelected.filter((file) =>
                favorites.some(
                    (favorite) => favorite.fileId === file._id
                )
            )
        }

        return filesSelected

    }
})

export const deleteFile = mutation({
    args: { fileId: v.id('files') },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)
        if (!access) throw new ConvexError("no access to file")

        await ctx.db.delete(args.fileId)
    }
})

export const toogleFavorite = mutation({
    args: { fileId: v.id('files') },
    async handler(ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId)

        if (!access) throw new ConvexError("no access to file")

        const { user, file } = access

        const favorite = await ctx.db
            .query("favorites")
            .withIndex("by_userId_orgId_fileId",
                q => q
                    .eq("userId", user._id)
                    .eq("orgId", file.orgId)
                    .eq("fileId", file._id)
            )
            .first()

        if (!favorite) {
            await ctx.db.insert("favorites", {
                fileId: file._id,
                userId: user._id,
                orgId: file.orgId,
            })
        } else {
            await ctx.db.delete(favorite._id)
        }
    }
})

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {
    const idenity = await ctx.auth.getUserIdentity()

    if (!idenity) return null

    const file = await ctx.db.get(fileId)

    if (!file) return null

    const hasAccess = await hasAccessToOrg(ctx, idenity.tokenIdentifier, file.orgId)

    if (!hasAccess) return null

    const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", idenity.tokenIdentifier))
        .first()

    if (!user) return null

    return { user, file }
}